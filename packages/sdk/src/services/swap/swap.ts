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
  SwapUserInputs,
} from './types';
import {
  baseAmountToNotionalBN,
  descale,
  notionalToBaseAmount,
  scale,
} from '../../utils/helpers';
import {
  SECONDS_IN_YEAR,
  VERY_BIG_NUMBER,
  WAD,
  ZERO_BN,
} from '../../utils/constants';
import {
  fixedRateToPrice,
  tickToFixedRate,
} from '../../utils/math/tickHelpers';
import { defaultAbiCoder } from 'ethers/lib/utils';
import { getPoolInfo } from '../../gateway/getPoolInfo';
import { PoolConfig } from '../../gateway/types';

export async function swap({
  ammId,
  signer,
  notional,
  margin,
  fixedRateLimit,
}: SwapArgs): Promise<ContractReceipt> {
  // fetch: send request to api

  const params = await createSwapParams({
    ammId,
    signer,
    notional,
    margin,
    fixedRateLimit,
  });

  const { data, value, chainId } = await getSwapTxData(params);
  const result = await executeTransaction(signer, data, value, chainId);
  return result;
}

export async function simulateSwap({
  ammId,
  signer,
  notional,
  margin,
  fixedRateLimit,
}: SwapArgs): Promise<InfoPostSwap> {
  // fetch: send request to api

  const params = await createSwapParams({
    ammId,
    signer,
    notional,
    margin,
    fixedRateLimit,
  });

  const { data, value, chainId } = await getSwapTxData(params);

  let txData: Transaction & { gasLimit: BigNumber };
  let bytesOutput: any;
  try {
    const res = await simulateTx(signer, data, value, chainId);
    txData = res.txData;
    bytesOutput = res.bytesOutput;
  } catch (e) {
    return {
      marginRequirement: -1,
      maxMarginWithdrawable: -1,
      availableNotional: -1,
      fee: -1,
      slippage: -1,
      averageFixedRate: -1,
      fixedTokenDeltaBalance: -1,
      variableTokenDeltaBalance: -1,
      fixedTokenDeltaUnbalanced: -1,
      gasFee: {
        value: -1,
        token: 'ETH',
      },
    };
  }

  const { executedBaseAmount, executedQuoteAmount, fee, im, currentTick } =
    decodeSwapOutput(bytesOutput);

  let availableNotionalRaw = ZERO_BN;
  {
    const { calldata: data, value } = await encodeSwap({
      ...params,
      fixedRateLimit:
        params.fixedRateLimit !== undefined ? params.fixedRateLimit : ZERO_BN,
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
  ammId,
  signer,
  notional,
  margin,
  fixedRateLimit,
}: SwapArgs): Promise<BigNumber> {
  const params = await createSwapParams({
    ammId,
    signer,
    notional,
    margin,
    fixedRateLimit,
  });

  const { data, value, chainId } = await getSwapTxData(params);
  const estimate = await estimateGas(signer, data, value, chainId);

  return estimate.gasLimit;
}

// HELPERS

export async function createSwapParams({
  ammId,
  signer,
  notional,
  margin,
  fixedRateLimit,
}: SwapArgs): Promise<CompleteSwapDetails> {
  const poolInfo = await getPoolInfo(ammId, await signer.getChainId());

  const baseAmount = notionalToBaseAmount(
    notional,
    poolInfo.quoteTokenDecimals,
    poolInfo.currentLiquidityIndex,
  );

  let fixedRateLimitRaw = ZERO_BN;
  if (fixedRateLimit !== undefined) {
    fixedRateLimitRaw = BigNumber.from(fixedRateToPrice(fixedRateLimit));
  }

  const params: CompleteSwapDetails = {
    ...poolInfo,
    owner: signer,
    baseAmount: baseAmount,
    margin: scale(poolInfo.quoteTokenDecimals)(margin),
    fixedRateLimit: fixedRateLimitRaw,
  };

  return params;
}

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
  const marginRequirement = descale(params.quoteTokenDecimals)(im);
  const descaledFee = descale(params.quoteTokenDecimals)(fee);

  const maxMarginWithdrawable =
    positionMargin === undefined ? 0 : positionMargin - marginRequirement;

  // available notional
  const availableNotional = descale(params.quoteTokenDecimals)(
    availableNotionalRaw,
  );

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
  const averageFixedRate = descale(18)(averageFixedRateInWad) * 100;

  return {
    marginRequirement: marginRequirement,
    maxMarginWithdrawable: maxMarginWithdrawable,
    availableNotional: availableNotional, // simulate with max notional
    fee: descaledFee,
    slippage: slippage,
    averageFixedRate: Math.abs(averageFixedRate),
    fixedTokenDeltaBalance: descale(params.quoteTokenDecimals)(
      executedQuoteAmount,
    ),
    variableTokenDeltaBalance: descale(params.quoteTokenDecimals)(
      executedBaseAmount,
    ),
    fixedTokenDeltaUnbalanced: -descale(params.quoteTokenDecimals)(
      executedBaseAmount,
    ), // how do we interpret unbalanced?
    gasFee: gasFee,
  };
}

export async function getSwapTxData(
  params: PoolConfig & SwapUserInputs,
): Promise<{
  data: string;
  value: string;
  chainId: number;
}> {
  const chainId = await params.owner.getChainId();

  if (params.chainId !== chainId) {
    throw new Error('Chain id mismatch between pool and signer');
  }

  const swapPeripheryParams: SwapPeripheryParameters = {
    ...params,
    fixedRateLimit:
      params.fixedRateLimit !== undefined ? params.fixedRateLimit : ZERO_BN,
  };

  const { calldata: data, value } = await encodeSwap(swapPeripheryParams);

  return {
    data,
    value,
    chainId,
  };
}
