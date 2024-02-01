import { BigDecimal, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts"
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
const Q96 = BigDecimal.fromString((2 ** 96).toString())

function createLoanSnapshot(tokenId: BigInt, loan: Loan, event: ethereum.Event) {

  // get current values
  let vault = V3Vault.bind(event.address)
  let info = vault.loanInfo(tokenId)

  let snapshot = new LoanSnapshot(event.transaction.hash.concatI32(event.logIndex.toI32()))
  
  snapshot.assets = info.getDebt()
  snapshot.shares = loan.shares
  snapshot.owner = loan.owner

  snapshot.blockNumber = event.block.number
  snapshot.blockTimestamp = event.block.timestamp

  snapshot.save()
}

function getLoan(tokenId: BigInt): Loan {
  let loan = Loan.load(event.params.tokenId)
  if (!loan) {
    loan = new Loan(event.params.tokenId)
  }
  return loan
}

export function handleAdd(event: Add): void {

  let loan = getLoan(event.params.tokenId)
  
  if (event.params.oldTokenId.gt(ZERO_BI)) {
    let oldLoan = Loan.load(event.params.oldTokenId)!
    loan.shares = oldLoan.shares
  } else {
    loan.shares = ZERO_BI
  }
  
  loan.owner = event.params.owner
  loan.save()

  createLoanSnapshot(event.params.tokenId, loan, event)
}

export function handleRemove(event: Remove): void {
  let loan = Loan.load(event.params.tokenId)!
  loan.shares = ZERO_BI
  loan.isExited = true
  loan.save()

  createLoanSnapshot(event.params.tokenId, loan, event)
}

export function handleBorrow(event: BorrowEvent): void {

  let loan = Loan.load(event.params.tokenId)!

  entity.shares = event.params.shares

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDeposit(event: DepositEvent): void {
  let entity = new Deposit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.owner = event.params.owner
  entity.assets = event.params.assets
  entity.shares = event.params.shares

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleExchangeRateUpdate(event: ExchangeRateUpdateEvent): void {

  let timestamp = event.block.timestamp.toI32()
  let dayID = event.address.concatI32(timestamp / 86400)
  let hourID = event.address.concatI32(timestamp / 3600)

  let daily = DailyExchangeRate.load(dayID)
  let hourly = HourlyExchangeRate.load(hourID)

  if (!daily) {
    daily = new DailyExchangeRate(dayID)
    daily.vault = event.address
    daily.debtExchangeRate = BigDecimal.fromString(event.params.debtExchangeRateX96.toString()).div(Q96)
    daily.lendExchangeRate = BigDecimal.fromString(event.params.lendExchangeRateX96.toString()).div(Q96)
    daily.blockNumber = event.block.number
    daily.blockTimestamp = event.block.timestamp
    daily.save()
  }
  if (!hourly) {
    hourly = new HourlyExchangeRate(hourID)
    hourly.vault = event.address
    hourly.debtExchangeRate = BigDecimal.fromString(event.params.debtExchangeRateX96.toString()).div(Q96)
    hourly.lendExchangeRate = BigDecimal.fromString(event.params.lendExchangeRateX96.toString()).div(Q96)
    hourly.blockNumber = event.block.number
    hourly.blockTimestamp = event.block.timestamp
    hourly.save()
  }
}

export function handleLiquidate(event: LiquidateEvent): void {
  let entity = new Liquidation(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId
  entity.liquidator = event.params.liquidator
  entity.owner = event.params.owner
  entity.value = event.params.value
  entity.cost = event.params.cost
  entity.amount0 = event.params.amount0
  entity.amount1 = event.params.amount1
  entity.reserve = event.params.reserve
  entity.missing = event.params.missing

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}