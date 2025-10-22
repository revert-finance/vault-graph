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
  LenderSnapshot,
  Loan,
  LoanSnapshot,
  DailyExchangeRate,
  HourlyExchangeRate,
  Liquidation
} from "../generated/schema"

const ZERO_BI = BigInt.fromI32(0)
const Q96 = BigDecimal.fromString(BigInt.fromI32(2).pow(96).toString())

// max 1 snapshot per block is saved
function createLoanSnapshot(loan: Loan, event: ethereum.Event, isRemoveEvent: boolean = false, amountRepaid: BigInt | null = null, amountBorrowed: BigInt | null = null) : void {
  // get current values
  let vault = V3Vault.bind(event.address)

  let snapshot = new LoanSnapshot(loan.id.concat(event.address).concat(getBytes(event.block.number)))
  snapshot.loan = loan.id

  // Try to get loan info, but handle the case where it reverts
  let infoResult = vault.try_loanInfo(loan.tokenId)

  if (!infoResult.reverted) {
    // Normal case - we got valid loan info
    let info = infoResult.value
    snapshot.debt = info.getDebt()
    snapshot.collateralValue = info.getCollateralValue()
    snapshot.fullValue = info.getFullValue()
  } else {
    // The loan info call reverted

    // Only set zeros for Remove events, otherwise skip creating the snapshot
    if (isRemoveEvent) {
      snapshot.debt = ZERO_BI
      snapshot.collateralValue = ZERO_BI
      snapshot.fullValue = ZERO_BI
    } else {
      // For other events, just return without creating a snapshot
      return
    }
  }

  snapshot.shares = loan.shares
  snapshot.owner = loan.owner

  snapshot.blockNumber = event.block.number
  snapshot.blockTimestamp = event.block.timestamp
  snapshot.transactionHash = event.transaction.hash

  // Set the actual amounts if provided
  snapshot.amountRepaid = amountRepaid
  snapshot.amountBorrowed = amountBorrowed

  snapshot.save()
}

// max 1 snapshot per block is saved
function createLenderSnapshot(lender: Lender, event: ethereum.Event) : void {

  // get current values
  let vault = V3Vault.bind(event.address)
  let lent = vault.lendInfo(Address.fromBytes(lender.address))

  let snapshot = new LenderSnapshot(lender.id.concat(event.address).concat(getBytes(event.block.number)))

  snapshot.lender = lender.id

  snapshot.lent = lent
  snapshot.shares = lender.shares

  snapshot.blockNumber = event.block.number
  snapshot.blockTimestamp = event.block.timestamp
  snapshot.transactionHash = event.transaction.hash

  snapshot.save()
}

function getBytes(number: BigInt) : Bytes {
  return Bytes.fromByteArray(Bytes.fromBigInt(number))
}

function getVault(address: Address): Vault {
  let vault = Vault.load(address)
  if (!vault) {
    let vaultContract = V3Vault.bind(address)
    vault = new Vault(address)
    vault.asset = vaultContract.asset()
    vault.decimals = BigInt.fromI32(vaultContract.decimals())
    vault.save()
  }
  return vault
}

function getLoan(tokenId: BigInt, vaultAddress: Address): Loan {
  let loan = Loan.load(getBytes(tokenId).concat(vaultAddress))
  if (!loan) {
    loan = new Loan(getBytes(tokenId).concat(vaultAddress))
    loan.tokenId = tokenId
    loan.vault = getVault(vaultAddress).id
    loan.isExited = false
  }
  return loan
}

function getLender(address: Address, vaultAddress: Address): Lender {
  let lender = Lender.load(address.concat(vaultAddress))
  if (!lender) {
    lender = new Lender(address.concat(vaultAddress))
    lender.address = address
    lender.vault = getVault(vaultAddress).id
    lender.shares = ZERO_BI;
  }
  return lender
}

export function handleAdd(event: Add): void {
  let loan = getLoan(event.params.tokenId, event.address)

  if (event.params.oldTokenId.gt(ZERO_BI)) {
    let oldLoan = Loan.load(getBytes(event.params.oldTokenId).concat(event.address))!
    loan.shares = oldLoan.shares
    loan.previousLoan = oldLoan.id
  } else {
    loan.shares = ZERO_BI
  }

  loan.owner = event.params.owner
  loan.save()

  // Pass false to indicate this is not a Remove event
  createLoanSnapshot(loan, event, false)
}

export function handleRemove(event: Remove): void {
  let loan = getLoan(event.params.tokenId, event.address)
  loan.isExited = true
  loan.save()

  // Pass true to indicate this is a Remove event
  createLoanSnapshot(loan, event, true)
}

export function handleBorrow(event: BorrowEvent): void {
  let loan = getLoan(event.params.tokenId, event.address)
  loan.shares = loan.shares.plus(event.params.shares)
  loan.save()

  createLoanSnapshot(loan, event, false, null, event.params.assets)
}

export function handleRepay(event: RepayEvent): void {
  let loan = getLoan(event.params.tokenId, event.address)
  loan.shares = loan.shares.minus(event.params.shares)
  loan.save()

  createLoanSnapshot(loan, event, false, event.params.assets, null)
}

export function handleDeposit(event: DepositEvent): void {
  let lender = getLender(event.params.owner, event.address)
  lender.shares = lender.shares.plus(event.params.shares);
  lender.save()

  createLenderSnapshot(lender, event)
}

export function handleWithdraw(event: WithdrawEvent): void {
  let lender = getLender(event.params.owner, event.address)
  lender.shares = lender.shares.minus(event.params.shares);
  lender.save()

  createLenderSnapshot(lender, event)
}

export function handleWithdrawCollateral(event: WithdrawCollateralEvent) : void {
  let loan = getLoan(event.params.tokenId, event.address)
  createLoanSnapshot(loan, event, false)
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
