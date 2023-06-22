import { BigNumber, ContractReceipt } from 'ethers';
import {
  estimateGas,
  executeTransaction,
  simulateTxExpectError,
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
import { descale, notionalToBaseAmount, scale } from '../../utils/helpers';
import { SECONDS_IN_YEAR, WAD, ZERO_BN } from '../../utils/constants';
import {
  fixedRateToPrice,
  tickToFixedRate,
} from '../../utils/math/tickHelpers';
import { getPoolInfo } from '../../gateway/getPoolInfo';
import { PoolConfig } from '../../gateway/types';
import { decodeSwap } from '../../utils/decodeOutput';
import { decodeImFromError } from '../../utils/errors/errorHandling';
import { getAvailableNotional } from '../poolSwapInfo/getAvailableNotional';
import {
  DEFAULT_EXECUTED_BASE,
  DEFAULT_EXECUTED_QUOTE,
  DEFAULT_FEE,
  DEFAULT_TICK,
} from '../../utils/errors/constants';

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
  let isError = false;
  try {
    const res = await simulateTxExpectError(signer, data, value, chainId);
    txData = res.txData;
    bytesOutput = res.bytesOutput;
    isError = res.isError;
  } catch (e) {
    throw new Error('Failed to simulate swap');
  }

  const { executedBaseAmount, executedQuoteAmount, fee, im, currentTick } =
    isError
      ? {
          executedBaseAmount: DEFAULT_EXECUTED_BASE,
          executedQuoteAmount: DEFAULT_EXECUTED_QUOTE,
          fee: DEFAULT_FEE,
          currentTick: DEFAULT_TICK,
          im: decodeImFromError(bytesOutput).marginRequirement,
        }
      : decodeSwap(bytesOutput, true, false, true, notional > 0);

  const availableNotional = await getAvailableNotional({
    isFT: notional > 0,
    chainId,
    params,
  });

  const result = await processInfoPostSwap(
    executedBaseAmount,
    executedQuoteAmount,
    fee,
    im,
    currentTick,
    scale(params.quoteTokenDecimals)(availableNotional),
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
  const poolInfo = await getPoolInfo(ammId);

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
  const descaledFee =
    fee === DEFAULT_FEE ? -1 : descale(params.quoteTokenDecimals)(fee);

  const maxMarginWithdrawable =
    positionMargin === undefined ? 0 : positionMargin - marginRequirement;

  // available notional
  const availableNotional = descale(params.quoteTokenDecimals)(
    availableNotionalRaw,
  );

  // SLIPPAGE
  const slippage = Math.abs(
    currentTick === DEFAULT_TICK
      ? -1
      : tickToFixedRate(currentTick) - params.currentFixedRate,
  );

  // AVG FIXED RATE
  // ft = -base * index * ( 1 + avgFR*timetillMaturity/year) = -notional * ( 1 + avgFR*timetillMaturity/year)
  let averageFixedRate = 0;
  if (executedQuoteAmount != null) {
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
    averageFixedRate = descale(18)(averageFixedRateInWad) * 100;
  }

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
