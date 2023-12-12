import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
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
} from "../generated/V3Vault/V3Vault"

export function createApprovalEvent(
  owner: Address,
  spender: Address,
  value: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return approvalEvent
}

export function createBorrowEvent(
  tokenId: BigInt,
  owner: Address,
  assets: BigInt,
  shares: BigInt
): Borrow {
  let borrowEvent = changetype<Borrow>(newMockEvent())

  borrowEvent.parameters = new Array()

  borrowEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  borrowEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  borrowEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )
  borrowEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return borrowEvent
}

export function createDepositEvent(
  sender: Address,
  owner: Address,
  assets: BigInt,
  shares: BigInt
): Deposit {
  let depositEvent = changetype<Deposit>(newMockEvent())

  depositEvent.parameters = new Array()

  depositEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return depositEvent
}

export function createExchangeRateUpdateEvent(
  debtExchangeRateX96: BigInt,
  lendExchangeRateX96: BigInt
): ExchangeRateUpdate {
  let exchangeRateUpdateEvent = changetype<ExchangeRateUpdate>(newMockEvent())

  exchangeRateUpdateEvent.parameters = new Array()

  exchangeRateUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "debtExchangeRateX96",
      ethereum.Value.fromUnsignedBigInt(debtExchangeRateX96)
    )
  )
  exchangeRateUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "lendExchangeRateX96",
      ethereum.Value.fromUnsignedBigInt(lendExchangeRateX96)
    )
  )

  return exchangeRateUpdateEvent
}

export function createLiquidateEvent(
  tokenId: BigInt,
  liquidator: Address,
  owner: Address,
  value: BigInt,
  cost: BigInt,
  amount0: BigInt,
  amount1: BigInt,
  reserve: BigInt,
  missing: BigInt
): Liquidate {
  let liquidateEvent = changetype<Liquidate>(newMockEvent())

  liquidateEvent.parameters = new Array()

  liquidateEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  liquidateEvent.parameters.push(
    new ethereum.EventParam(
      "liquidator",
      ethereum.Value.fromAddress(liquidator)
    )
  )
  liquidateEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  liquidateEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )
  liquidateEvent.parameters.push(
    new ethereum.EventParam("cost", ethereum.Value.fromUnsignedBigInt(cost))
  )
  liquidateEvent.parameters.push(
    new ethereum.EventParam(
      "amount0",
      ethereum.Value.fromUnsignedBigInt(amount0)
    )
  )
  liquidateEvent.parameters.push(
    new ethereum.EventParam(
      "amount1",
      ethereum.Value.fromUnsignedBigInt(amount1)
    )
  )
  liquidateEvent.parameters.push(
    new ethereum.EventParam(
      "reserve",
      ethereum.Value.fromUnsignedBigInt(reserve)
    )
  )
  liquidateEvent.parameters.push(
    new ethereum.EventParam(
      "missing",
      ethereum.Value.fromUnsignedBigInt(missing)
    )
  )

  return liquidateEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createRepayEvent(
  tokenId: BigInt,
  repayer: Address,
  owner: Address,
  assets: BigInt,
  shares: BigInt
): Repay {
  let repayEvent = changetype<Repay>(newMockEvent())

  repayEvent.parameters = new Array()

  repayEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  repayEvent.parameters.push(
    new ethereum.EventParam("repayer", ethereum.Value.fromAddress(repayer))
  )
  repayEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  repayEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )
  repayEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return repayEvent
}

export function createSetLimitsEvent(
  globalLendLimit: BigInt,
  globalDebtLimit: BigInt
): SetLimits {
  let setLimitsEvent = changetype<SetLimits>(newMockEvent())

  setLimitsEvent.parameters = new Array()

  setLimitsEvent.parameters.push(
    new ethereum.EventParam(
      "globalLendLimit",
      ethereum.Value.fromUnsignedBigInt(globalLendLimit)
    )
  )
  setLimitsEvent.parameters.push(
    new ethereum.EventParam(
      "globalDebtLimit",
      ethereum.Value.fromUnsignedBigInt(globalDebtLimit)
    )
  )

  return setLimitsEvent
}

export function createSetReserveFactorEvent(
  reserveFactorX32: BigInt
): SetReserveFactor {
  let setReserveFactorEvent = changetype<SetReserveFactor>(newMockEvent())

  setReserveFactorEvent.parameters = new Array()

  setReserveFactorEvent.parameters.push(
    new ethereum.EventParam(
      "reserveFactorX32",
      ethereum.Value.fromUnsignedBigInt(reserveFactorX32)
    )
  )

  return setReserveFactorEvent
}

export function createSetReserveProtectionFactorEvent(
  reserveProtectionFactorX32: BigInt
): SetReserveProtectionFactor {
  let setReserveProtectionFactorEvent = changetype<SetReserveProtectionFactor>(
    newMockEvent()
  )

  setReserveProtectionFactorEvent.parameters = new Array()

  setReserveProtectionFactorEvent.parameters.push(
    new ethereum.EventParam(
      "reserveProtectionFactorX32",
      ethereum.Value.fromUnsignedBigInt(reserveProtectionFactorX32)
    )
  )

  return setReserveProtectionFactorEvent
}

export function createSetTokenConfigEvent(
  token: Address,
  collateralFactorX32: BigInt,
  collateralValueLimit: BigInt
): SetTokenConfig {
  let setTokenConfigEvent = changetype<SetTokenConfig>(newMockEvent())

  setTokenConfigEvent.parameters = new Array()

  setTokenConfigEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  setTokenConfigEvent.parameters.push(
    new ethereum.EventParam(
      "collateralFactorX32",
      ethereum.Value.fromUnsignedBigInt(collateralFactorX32)
    )
  )
  setTokenConfigEvent.parameters.push(
    new ethereum.EventParam(
      "collateralValueLimit",
      ethereum.Value.fromUnsignedBigInt(collateralValueLimit)
    )
  )

  return setTokenConfigEvent
}

export function createSetTransformerEvent(
  transformer: Address,
  active: boolean
): SetTransformer {
  let setTransformerEvent = changetype<SetTransformer>(newMockEvent())

  setTransformerEvent.parameters = new Array()

  setTransformerEvent.parameters.push(
    new ethereum.EventParam(
      "transformer",
      ethereum.Value.fromAddress(transformer)
    )
  )
  setTransformerEvent.parameters.push(
    new ethereum.EventParam("active", ethereum.Value.fromBoolean(active))
  )

  return setTransformerEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  value: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return transferEvent
}

export function createWithdrawEvent(
  sender: Address,
  receiver: Address,
  owner: Address,
  assets: BigInt,
  shares: BigInt
): Withdraw {
  let withdrawEvent = changetype<Withdraw>(newMockEvent())

  withdrawEvent.parameters = new Array()

  withdrawEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromUnsignedBigInt(assets))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return withdrawEvent
}

export function createWithdrawCollateralEvent(
  tokenId: BigInt,
  owner: Address,
  recipient: Address,
  liquidity: BigInt,
  amount0: BigInt,
  amount1: BigInt
): WithdrawCollateral {
  let withdrawCollateralEvent = changetype<WithdrawCollateral>(newMockEvent())

  withdrawCollateralEvent.parameters = new Array()

  withdrawCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  withdrawCollateralEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  withdrawCollateralEvent.parameters.push(
    new ethereum.EventParam("recipient", ethereum.Value.fromAddress(recipient))
  )
  withdrawCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "liquidity",
      ethereum.Value.fromUnsignedBigInt(liquidity)
    )
  )
  withdrawCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "amount0",
      ethereum.Value.fromUnsignedBigInt(amount0)
    )
  )
  withdrawCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "amount1",
      ethereum.Value.fromUnsignedBigInt(amount1)
    )
  )

  return withdrawCollateralEvent
}

export function createWithdrawReservesEvent(
  amount: BigInt,
  receiver: Address
): WithdrawReserves {
  let withdrawReservesEvent = changetype<WithdrawReserves>(newMockEvent())

  withdrawReservesEvent.parameters = new Array()

  withdrawReservesEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  withdrawReservesEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )

  return withdrawReservesEvent
}
