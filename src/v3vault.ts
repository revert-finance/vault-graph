import { Address, BigDecimal, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts"
import {
  Approval as ApprovalEvent,
  Borrow as BorrowEvent,
  Deposit as DepositEvent,
  ExchangeRateUpdate as ExchangeRateUpdateEvent,
  Liquidate as LiquidateEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Repay as RepayEvent,
  SetLimits as SetLimitsEvent,
  SetReserveFactor as SetReserveFactorEvent,
  SetReserveProtectionFactor as SetReserveProtectionFactorEvent,
  SetTokenConfig as SetTokenConfigEvent,
  SetTransformer as SetTransformerEvent,
  Transfer as TransferEvent,
  Withdraw as WithdrawEvent,
  WithdrawCollateral as WithdrawCollateralEvent,
  WithdrawReserves as WithdrawReservesEvent,
  Add,
  Remove,
  V3Vault
} from "../generated/V3Vault/V3Vault"

import {
  Vault,
  Lender,
  Loan,
  LoanSnapshot,
  DailyExchangeRate,
  HourlyExchangeRate,
  Liquidation
} from "../generated/schema"

const ZERO_BI = BigInt.fromI32(0)
const Q96 = BigDecimal.fromString(BigInt.fromI32(2).pow(96).toString())

// max 1 snapshot per block is saved
function createLoanSnapshot(tokenId: BigInt, loan: Loan, event: ethereum.Event) : void {

  // get current values
  let vault = V3Vault.bind(event.address)
  let info = vault.loanInfo(tokenId)

  let snapshot = new LoanSnapshot(loan.id.concat(event.address).concat(getBytes(event.block.number)))
  
  snapshot.loan = loan.id

  snapshot.debt = info.getDebt()
  snapshot.collateralValue = info.getCollateralValue()
  snapshot.fullValue = info.getFullValue()

  snapshot.shares = loan.shares
  snapshot.owner = loan.owner

  snapshot.blockNumber = event.block.number
  snapshot.blockTimestamp = event.block.timestamp
  snapshot.transactionHash = event.transaction.hash

  snapshot.save()
}

function getBytes(number: BigInt) : Bytes {
  return Bytes.fromByteArray(Bytes.fromBigInt(number))
}

function getVault(vault: Address): Vault {
  let v = Vault.load(vault)
  if (!v) {
    let vaultContract = V3Vault.bind(vault)
    v = new Vault(vault)
    v.asset = vaultContract.asset()
    v.decimals = BigInt.fromI32(vaultContract.decimals())
    v.save()
  }
  return v
}

function getLoan(tokenId: BigInt, vault: Address): Loan {
  let loan = Loan.load(getBytes(tokenId).concat(vault))
  if (!loan) {
    loan = new Loan(getBytes(tokenId).concat(vault))
    loan.tokenId = tokenId
    loan.vault = getVault(vault).id
    loan.isExited = false
  }
  return loan
}

function getLender(address: Bytes, vault: Address): Lender {
  let lender = Lender.load(address.concat(vault))
  if (!lender) {
    lender = new Lender(address.concat(vault))
    lender.vault = getVault(vault).id
    lender.shares = ZERO_BI;
  }
  return lender
}

export function handleAdd(event: Add): void {

  let loan = getLoan(event.params.tokenId, event.address)
  
  if (event.params.oldTokenId.gt(ZERO_BI)) {
    let oldLoan = Loan.load(getBytes(event.params.oldTokenId))!
    loan.shares = oldLoan.shares
    loan.previousLoan = oldLoan.id
  } else {
    loan.shares = ZERO_BI
  }
  
  loan.owner = event.params.owner
  loan.save()

  createLoanSnapshot(event.params.tokenId, loan, event)
}

export function handleRemove(event: Remove): void {
  let loan = getLoan(event.params.tokenId, event.address)
  loan.isExited = true
  loan.save()

  createLoanSnapshot(event.params.tokenId, loan, event)
}

export function handleBorrow(event: BorrowEvent): void {
  let loan = getLoan(event.params.tokenId, event.address)
  loan.shares = loan.shares.plus(event.params.shares)
  loan.save()

  createLoanSnapshot(event.params.tokenId, loan, event)
}

export function handleRepay(event: RepayEvent): void {
  let loan = getLoan(event.params.tokenId, event.address)
  loan.shares = loan.shares.minus(event.params.shares)
  loan.save()

  createLoanSnapshot(event.params.tokenId, loan, event)
}

export function handleDeposit(event: DepositEvent): void {
  let lender = getLender(event.params.owner, event.address)
  lender.shares = lender.shares.plus(event.params.shares);
  lender.save()
}

export function handleWithdraw(event: WithdrawEvent): void {
  let lender = getLender(event.params.owner, event.address)
  lender.shares = lender.shares.minus(event.params.shares);
  lender.save()
}

export function handleWithdrawCollateral(event: WithdrawCollateralEvent) : void {
  let loan = getLoan(event.params.tokenId, event.address)
  createLoanSnapshot(event.params.tokenId, loan, event)
}

export function handleExchangeRateUpdate(event: ExchangeRateUpdateEvent): void {

  let timestamp = event.block.timestamp.toI32()
  let dayID = event.address.concatI32(timestamp / 86400)
  let hourID = event.address.concatI32(timestamp / 3600)

  let daily = DailyExchangeRate.load(dayID)
  let hourly = HourlyExchangeRate.load(hourID)

  if (!daily) {
    daily = new DailyExchangeRate(dayID)
    daily.day = BigInt.fromI32(timestamp / 86400)
    daily.vault = event.address
    daily.debtExchangeRate = BigDecimal.fromString(event.params.debtExchangeRateX96.toString()).div(Q96)
    daily.lendExchangeRate = BigDecimal.fromString(event.params.lendExchangeRateX96.toString()).div(Q96)
    daily.blockNumber = event.block.number
    daily.blockTimestamp = event.block.timestamp
    daily.save()
  }
  if (!hourly) {
    hourly = new HourlyExchangeRate(hourID)
    hourly.hour = BigInt.fromI32(timestamp / 3600)
    hourly.vault = event.address
    hourly.debtExchangeRate = BigDecimal.fromString(event.params.debtExchangeRateX96.toString()).div(Q96)
    hourly.lendExchangeRate = BigDecimal.fromString(event.params.lendExchangeRateX96.toString()).div(Q96)
    hourly.blockNumber = event.block.number
    hourly.blockTimestamp = event.block.timestamp
    hourly.save()
  }
}

export function handleLiquidate(event: LiquidateEvent): void {
  let liquidation = new Liquidation(event.transaction.hash.concatI32(event.logIndex.toI32()))

  liquidation.loan = getLoan(event.params.tokenId, event.address).id
  liquidation.liquidator = event.params.liquidator
  liquidation.owner = event.params.owner
  liquidation.value = event.params.value
  liquidation.cost = event.params.cost

  liquidation.amount0 = event.params.amount0
  liquidation.amount1 = event.params.amount1
  
  liquidation.reserve = event.params.reserve
  liquidation.missing = event.params.missing

  liquidation.blockNumber = event.block.number
  liquidation.blockTimestamp = event.block.timestamp
  liquidation.transactionHash = event.transaction.hash
  liquidation.save()
}