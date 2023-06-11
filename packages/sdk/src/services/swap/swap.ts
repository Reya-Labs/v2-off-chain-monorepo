import { BigNumber, ContractReceipt } from 'ethers';
import {
  estimateGas,
  executeTransaction,
  simulateTx,
  Transaction,
} from '../executeTransaction';
import { encodeSwap } from './encode';
import {
  getNativeGasToken,
  convertGasUnitsToNativeTokenUnits,
} from '@voltz-protocol/sdk-v1-stateless';
import {
  CompleteSwapDetails,
  InfoPostSwap,
  SwapArgs,
  SwapPeripheryParameters,
} from './types';
import { getSwapPeripheryParams } from './getSwapPeripheryParams';
import {
  getTokenDetails,
  scale,
  descale,
  SECONDS_IN_YEAR,
} from '@voltz-protocol/commons-v2';
import {
  baseAmountToNotionalBN,
  notionalToBaseAmount,
} from '../../utils/helpers';
import { VERY_BIG_NUMBER, WAD, ZERO_BN } from '../../utils/constants';
import {
  fixedRateToPrice,
  tickToFixedRate,
} from '../../utils/math/tickHelpers';
import { defaultAbiCoder } from 'ethers/lib/utils';

async function createSwapParams({
  poolId,
  signer,
  notionalAmount,
  marginAmount,
  priceLimit,
}: SwapArgs): Promise<CompleteSwapDetails> {
  const swapInfo = await getSwapPeripheryParams(poolId);

  const tokenDecimals = getTokenDetails(
    swapInfo.quoteTokenAddress,
  ).tokenDecimals;
  const baseAmount = notionalToBaseAmount(
    notionalAmount,
    tokenDecimals,
    swapInfo.currentLiquidityIndex,
  );

  let priceLimitRaw = ZERO_BN;
  if (priceLimit !== undefined) {
    priceLimitRaw = BigNumber.from(fixedRateToPrice(priceLimit));
  }

  const params: CompleteSwapDetails = {
    ...swapInfo,
    owner: signer,
    baseAmount: baseAmount,
    marginAmount: scale(tokenDecimals)(marginAmount),
    priceLimit: priceLimitRaw,
  };

  return params;
}

export async function swap({
  poolId,
  signer,
  notionalAmount,
  marginAmount,
  priceLimit,
}: SwapArgs): Promise<ContractReceipt> {
  // fetch: send request to api

  const params = await createSwapParams({
    poolId,
    signer,
    notionalAmount,
    marginAmount,
    priceLimit,
  });

  const { data, value, chainId } = await getSwapTxData(params);
  const result = await executeTransaction(signer, data, value, chainId);
  return result;
}

export async function getInfoPostSwap({
  poolId,
  signer,
  notionalAmount,
  marginAmount,
  priceLimit,
}: SwapArgs): Promise<InfoPostSwap> {
  // fetch: send request to api

  const params = await createSwapParams({
    poolId,
    signer,
    notionalAmount,
    marginAmount,
    priceLimit,
  });

  const { data, value, chainId } = await getSwapTxData(params);
  const { txData, bytesOutput } = await simulateTx(
    signer,
    data,
    value,
    chainId,
  );

  const { executedBaseAmount, executedQuoteAmount, fee, im, currentTick } =
    decodeSwapOutput(bytesOutput);

  let availableNotionalRaw = ZERO_BN;
  {
    const { calldata: data, value } = await encodeSwap({
      ...params,
      priceLimit: params.priceLimit !== undefined ? params.priceLimit : ZERO_BN,
      baseAmount: VERY_BIG_NUMBER,
    });
    const bytesOutput = (await simulateTx(signer, data, value, chainId))
      .bytesOutput;

    const executedBaseAmount = decodeSwapOutput(bytesOutput).executedBaseAmount;
    availableNotionalRaw = baseAmountToNotionalBN(
      executedBaseAmount,
      params.currentLiquidityIndex,
    );
  }

  const result = await processInfoPostSwap(
    executedBaseAmount,
    executedQuoteAmount,
    fee,
    im,
    currentTick,
    availableNotionalRaw,
    txData,
    params,
  );

  return result;
}

export async function estimateSwapGasUnits({
  poolId,
  signer,
  notionalAmount,
  marginAmount,
  priceLimit,
}: SwapArgs): Promise<BigNumber> {
  const params = await createSwapParams({
    poolId,
    signer,
    notionalAmount,
    marginAmount,
    priceLimit,
  });

  const { data, value, chainId } = await getSwapTxData(params);
  const estimate = await estimateGas(signer, data, value, chainId);

  return estimate.gasLimit;
}

// HELPERS

export function decodeSwapOutput(bytesData: any): {
  executedBaseAmount: BigNumber;
  executedQuoteAmount: BigNumber;
  fee: BigNumber;
  im: BigNumber;
  currentTick: number;
} {
  // (int256 executedBaseAmount, int256 executedQuoteAmount, uint256 fee, uint256 im, int24 currentTick)
  if (!bytesData[0]) {
    throw new Error('unable to decode Swap output');
  }

  const result = defaultAbiCoder.decode(
    ['int256', 'int256', 'uint256', 'uint256', 'int24'],
    bytesData[0],
  );

  return {
    executedBaseAmount: result[0],
    executedQuoteAmount: result[1],
    fee: result[2],
    im: result[3],
    currentTick: result[4],
  };
}

export async function processInfoPostSwap(
  executedBaseAmount: BigNumber,
  executedQuoteAmount: BigNumber,
  fee: BigNumber,
  im: BigNumber,
  currentTick: number,
  availableNotionalRaw: BigNumber,
  txData: Transaction & {
    gasLimit: BigNumber;
  },
  params: CompleteSwapDetails,
  positionMargin?: number,
): Promise<InfoPostSwap> {
  const provider = params.owner.provider;
  if (!provider) {
    throw new Error(`Missing provider for ${await params.owner.getAddress()}`);
  }
  const price = await convertGasUnitsToNativeTokenUnits(
    provider,
    txData.gasLimit.toNumber(),
  );

  const gasFee = {
    value: price,
    token: await getNativeGasToken(provider),
  };

  // MARGIN & FEE
  const tokenDecimals = getTokenDetails(params.quoteTokenAddress).tokenDecimals;
  const marginRequirement = descale(tokenDecimals)(im);
  const descaledFee = descale(tokenDecimals)(fee);

  const maxMarginWithdrawable =
    positionMargin === undefined ? 0 : positionMargin - marginRequirement;

  // available notional
  const availableNotional = descale(tokenDecimals)(availableNotionalRaw);

  // SLIPPAGE
  const fixedRateDelta = tickToFixedRate(currentTick) - params.currentFixedRate;
  const slippage = Math.abs(fixedRateDelta);

  // AVG FIXED RATE
  // ft = -base * index * ( 1 + avgFR*timetillMaturity/year) = -notional * ( 1 + avgFR*timetillMaturity/year)
  const yearsTillMaturityinWad = BigNumber.from(SECONDS_IN_YEAR)
    .mul(WAD)
    .div(Math.round(Date.now() / 1000) - params.maturityTimestamp);
  const fixedRateTillMaturityInWad = executedQuoteAmount
    .mul(WAD)
    .div(availableNotionalRaw)
    .sub(WAD);
  const averageFixedRateInWad = availableNotionalRaw.eq(ZERO_BN)
    ? ZERO_BN
    : fixedRateTillMaturityInWad.mul(WAD).div(yearsTillMaturityinWad);
  const averageFixedRate = descale(18)(averageFixedRateInWad);

  return {
    marginRequirement: marginRequirement,
    maxMarginWithdrawable: maxMarginWithdrawable,
    availableNotional: availableNotional, // simulate with max notional
    fee: descaledFee,
    slippage: slippage,
    averageFixedRate: Math.abs(averageFixedRate),
    fixedTokenDeltaBalance: descale(tokenDecimals)(executedQuoteAmount),
    variableTokenDeltaBalance: descale(tokenDecimals)(executedBaseAmount),
    fixedTokenDeltaUnbalanced: -descale(tokenDecimals)(executedBaseAmount), // how do we interpret unbalanced?
    gasFee: gasFee,
  };
}

async function getSwapTxData(params: CompleteSwapDetails): Promise<{
  data: string;
  value: string;
  chainId: number;
}> {
  const chainId = await params.owner.getChainId();
  const swapPeripheryParams: SwapPeripheryParameters = {
    ...params,
    priceLimit: params.priceLimit !== undefined ? params.priceLimit : ZERO_BN,
  };

  const { calldata: data, value } = await encodeSwap(swapPeripheryParams);

  return {
    data,
    value,
    chainId,
  };
}
