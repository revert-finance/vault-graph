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
  WithdrawReserves as WithdrawReservesEvent
} from "../generated/V3Vault/V3Vault"
import {
  Approval,
  Borrow,
  Deposit,
  ExchangeRateUpdate,
  Liquidate,
  OwnershipTransferred,
  Repay,
  SetLimits,
  SetReserveFactor,
  SetReserveProtectionFactor,
  SetTokenConfig,
  SetTransformer,
  Transfer,
  Withdraw,
  WithdrawCollateral,
  WithdrawReserves
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBorrow(event: BorrowEvent): void {
  let entity = new Borrow(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId
  entity.owner = event.params.owner
  entity.assets = event.params.assets
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
  let entity = new ExchangeRateUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.debtExchangeRateX96 = event.params.debtExchangeRateX96
  entity.lendExchangeRateX96 = event.params.lendExchangeRateX96

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLiquidate(event: LiquidateEvent): void {
  let entity = new Liquidate(
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

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRepay(event: RepayEvent): void {
  let entity = new Repay(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId
  entity.repayer = event.params.repayer
  entity.owner = event.params.owner
  entity.assets = event.params.assets
  entity.shares = event.params.shares

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetLimits(event: SetLimitsEvent): void {
  let entity = new SetLimits(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.globalLendLimit = event.params.globalLendLimit
  entity.globalDebtLimit = event.params.globalDebtLimit

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetReserveFactor(event: SetReserveFactorEvent): void {
  let entity = new SetReserveFactor(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reserveFactorX32 = event.params.reserveFactorX32

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetReserveProtectionFactor(
  event: SetReserveProtectionFactorEvent
): void {
  let entity = new SetReserveProtectionFactor(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reserveProtectionFactorX32 = event.params.reserveProtectionFactorX32

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetTokenConfig(event: SetTokenConfigEvent): void {
  let entity = new SetTokenConfig(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.collateralFactorX32 = event.params.collateralFactorX32
  entity.collateralValueLimit = event.params.collateralValueLimit

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetTransformer(event: SetTransformerEvent): void {
  let entity = new SetTransformer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.transformer = event.params.transformer
  entity.active = event.params.active

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdraw(event: WithdrawEvent): void {
  let entity = new Withdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.receiver = event.params.receiver
  entity.owner = event.params.owner
  entity.assets = event.params.assets
  entity.shares = event.params.shares

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdrawCollateral(event: WithdrawCollateralEvent): void {
  let entity = new WithdrawCollateral(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId
  entity.owner = event.params.owner
  entity.recipient = event.params.recipient
  entity.liquidity = event.params.liquidity
  entity.amount0 = event.params.amount0
  entity.amount1 = event.params.amount1

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdrawReserves(event: WithdrawReservesEvent): void {
  let entity = new WithdrawReserves(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.amount = event.params.amount
  entity.receiver = event.params.receiver

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
