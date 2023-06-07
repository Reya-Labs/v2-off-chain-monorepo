import { abi } from '../../abis/ExecutionModule.json';
import { TickMath } from '@uniswap/v3-sdk';
import { BigNumber, ethers } from 'ethers';
import { closestTickAndFixedRate } from '../utils/math/tickHelpers';
import { createAccountId, scaleAmount } from '../utils/helpers';
import { CommandType, getCommand } from '../utils/routerCommands';
import {
  BaseTrade,
  MakerTrade,
  MethodParameters,
  MultiAction,
  SettleTradeMaker,
  TakerTrade,
} from '../utils/types';
import { getTokenInfo } from '../utils/constants';

export async function encodeMakerOrder(
  trade: MakerTrade,
): Promise<MethodParameters> {
  const multiAction = new MultiAction();

  if (!trade.accountId) {
    // open account
    const accountId = await createAccountId(
      trade,
      true,
      trade.fixedRateLower,
      trade.fixedRateUpper,
    );
    trade.accountId = accountId;
    encodeSingleOpenAccount(trade, multiAction);
  }

  // deposit
  const ethAmount = encodeDeposit(trade, multiAction);

  if (trade.baseAmount) {
    // swap
    encodeSingleMakerOrder(trade, multiAction);
  }

  return encodeRouterCall(multiAction, BigNumber.from(ethAmount));
}

export async function encodeTakerOrder(
  trade: TakerTrade,
): Promise<MethodParameters> {
  const multiAction = new MultiAction();

  if (!trade.accountId) {
    // open account
    const accountId = await createAccountId(trade, false);
    trade.accountId = accountId;
    encodeSingleOpenAccount(trade as BaseTrade, multiAction);
  }

  // deposit
  const ethAmount = encodeDeposit(trade, multiAction);

  if (trade.baseAmount) {
    // swap
    encodeSingleSwap(trade, multiAction);
  }

  return encodeRouterCall(multiAction, BigNumber.from(ethAmount));
}

export function encodeSettlement(
  trade: TakerTrade,
  newMakerOrder?: MakerTrade,
  newTakerOrder?: TakerTrade,
): MethodParameters {
  const multiAction = new MultiAction();

  // settle
  encodeSingleSettle(trade, multiAction);

  if (!newMakerOrder && !newTakerOrder) {
    // withdraw
    encodeSingleWithdraw(trade, multiAction);
  }

  if (newMakerOrder && newMakerOrder.baseAmount) {
    // rollover
    encodeSingleMakerOrder(newMakerOrder, multiAction);
  }

  if (newTakerOrder && newTakerOrder.baseAmount) {
    // rollover
    encodeSingleSwap(newTakerOrder, multiAction);
  }

  return encodeRouterCall(multiAction, BigNumber.from(0));
}

////////////////////  ENCODE SINGLE  ////////////////////

function encodeSingleSettle(trade: BaseTrade, multiAction: MultiAction) {
  multiAction.newAction(
    getCommand(CommandType.V2_DATED_IRS_INSTRUMENT_SETTLE, [
      trade.accountId,
      trade.marketId,
      trade.maturityTimestamp,
    ]),
  );
}

export const encodeSingleSwap = (
  trade: TakerTrade,
  multiAction: MultiAction,
) => {
  const scaledBaseAmount = scaleAmount(
    trade.baseAmount,
    trade.quoteTokenAddress,
  );
  multiAction.newAction(
    getCommand(CommandType.V2_DATED_IRS_INSTRUMENT_SWAP, [
      trade.accountId,
      trade.marketId,
      trade.maturityTimestamp,
      scaledBaseAmount,
    ]),
  );
};

export const encodeSingleMakerOrder = (
  trade: MakerTrade,
  multiAction: MultiAction,
) => {
  const scaledBaseAmount = scaleAmount(
    trade.baseAmount,
    trade.quoteTokenAddress,
  );
  const { closestUsableTick: tickUpper } = closestTickAndFixedRate(
    trade.fixedRateLower,
  );
  const sqrtPriceLowerX96 = TickMath.getSqrtRatioAtTick(tickUpper).toString();

  const { closestUsableTick: tickLower } = closestTickAndFixedRate(
    trade.fixedRateUpper,
  );
  const sqrtPriceUpperX96 = TickMath.getSqrtRatioAtTick(tickLower).toString();

  multiAction.newAction(
    getCommand(CommandType.V2_VAMM_EXCHANGE_LP, [
      trade.accountId,
      trade.marketId,
      trade.maturityTimestamp,
      sqrtPriceLowerX96,
      sqrtPriceUpperX96,
      scaledBaseAmount,
    ]),
  );
};

export const encodeSingleOpenAccount = (
  trade: BaseTrade,
  multiAction: MultiAction,
): void => {
  multiAction.newAction(
    getCommand(CommandType.V2_OPEN_ACCOUNT, [trade.accountId]),
  );
  return;
};

export const encodeSingleApprove = (
  marginAmount: BigNumber,
  multiAction: MultiAction,
) => {
  // approve
  // todo: permit command & look into encodePermit Uniswap
  // multiAction.newAction(one);
};

export const encodeSingleWithdraw = (
  trade: MakerTrade | TakerTrade,
  multiAction: MultiAction,
) => {
  const scaledAmount = scaleAmount(trade.marginAmount, trade.quoteTokenAddress);
  multiAction.newAction(
    getCommand(CommandType.V2_CORE_WITHDRAW, [
      trade.accountId,
      trade.quoteTokenAddress,
      scaledAmount,
    ]),
  );
};

export const encodeSingleDepositERC20 = (
  trade: MakerTrade | TakerTrade,
  multiAction: MultiAction,
) => {
  const scaledAmount = scaleAmount(trade.marginAmount, trade.quoteTokenAddress);
  multiAction.newAction(
    getCommand(CommandType.V2_CORE_DEPOSIT, [
      trade.accountId,
      trade.quoteTokenAddress,
      scaledAmount,
    ]),
  );
};

export const encodeSingleDepositETH = (
  trade: MakerTrade | TakerTrade,
  multiAction: MultiAction,
) => {
  multiAction.newAction(
    getCommand(CommandType.V2_CORE_DEPOSIT, [
      trade.accountId,
      trade.quoteTokenAddress,
      '0',
    ]),
  );
};

// encodes commands & inpus into calldata based on Router Interface
// consideres tx value (ETH)
export const encodeRouterCall = (
  multiAction: MultiAction,
  nativeCurrencyValue: BigNumber,
): MethodParameters => {
  const functionSignature = 'execute(bytes,bytes[])';
  const parameters = [multiAction.commands, multiAction.inputs];
  const INTERFACE = new ethers.utils.Interface(abi);
  const calldata = INTERFACE.encodeFunctionData(functionSignature, parameters);
  return { calldata: calldata, value: nativeCurrencyValue.toHexString() };
};

const encodeDeposit = (trade: TakerTrade, multiAction: MultiAction): string => {
  let ethAmount = '0';
  if (trade.marginAmount > 0) {
    // scale amount
    const isETH = getTokenInfo(trade.quoteTokenAddress).name === 'ETH';
    if (trade.marginAmount > 0 && !isETH) {
      encodeSingleApprove(BigNumber.from(trade.marginAmount), multiAction);
    }
    // deposit
    if (isETH) {
      encodeSingleDepositETH(trade, multiAction);
      ethAmount = scaleAmount(trade.marginAmount, trade.quoteTokenAddress);
    } else {
      encodeSingleDepositERC20(trade, multiAction);
    }
  } else if (trade.marginAmount < 0) {
    // withdraw
    encodeSingleWithdraw(
      { ...trade, marginAmount: -trade.marginAmount },
      multiAction,
    );
  }

  return ethAmount;
};
