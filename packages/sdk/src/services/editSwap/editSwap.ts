import { BigNumber, ContractReceipt } from 'ethers';
import {
  estimateGas,
  executeTransaction,
  simulateTx,
} from '../executeTransaction';
import { encodeSwap } from '../swap/encode';
import {
  CompleteEditSwapDetails,
  EditSwapArgs,
  EditSwapPeripheryParameters,
} from './types';
import {
  baseAmountToNotionalBN,
  notionalToBaseAmount,
  scale,
} from '../../utils/helpers';
import { VERY_BIG_NUMBER, ZERO_BN } from '../../utils/constants';
import { fixedRateToPrice } from '../../utils/math/tickHelpers';
import { InfoPostSwap, processInfoPostSwap } from '../swap';
import { getPositionInfo } from '../../gateway/getPositionInfo';
import { decodeSwap } from '../../utils/decodeOutput';

export async function editSwap({
  positionId,
  signer,
  notional,
  margin,
  fixedRateLimit,
}: EditSwapArgs): Promise<ContractReceipt> {
  // fetch: send request to api

  const params = await createEditSwapParams({
    positionId,
    signer,
    notional,
    margin,
    fixedRateLimit,
  });

  const { data, value, chainId } = await getEditSwapTxData(params);
  const result = await executeTransaction(signer, data, value, chainId);
  return result;
}

export async function simulateEditSwap({
  positionId,
  signer,
  notional,
  margin,
  fixedRateLimit,
}: EditSwapArgs): Promise<InfoPostSwap> {
  const params = await createEditSwapParams({
    positionId,
    signer,
    notional,
    margin,
    fixedRateLimit,
  });

  // SIMULATE TX

  const { data, value, chainId } = await getEditSwapTxData(params);
  const { txData, bytesOutput } = await simulateTx(
    signer,
    data,
    value,
    chainId,
  );

  const { executedBaseAmount, executedQuoteAmount, fee, im, currentTick } =
    decodeSwap(bytesOutput, false, margin < 0, margin > 0, notional > 0);

  // SIMULATE WITH MAX NOTIONAL

  let availableNotionalRaw = ZERO_BN;
  {
    const { data, value, chainId } = await getEditSwapTxData({
      ...params,
      baseAmount: VERY_BIG_NUMBER,
    });
    const bytesOutput = (await simulateTx(signer, data, value, chainId))
      .bytesOutput;

    const executedBaseAmount = decodeSwap(
      bytesOutput,
      false,
      margin < 0,
      margin > 0,
      true,
    ).executedBaseAmount;
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
    params.positionMargin,
  );

  return result;
}

////// HELPERS

async function createEditSwapParams({
  positionId,
  signer,
  notional,
  margin,
  fixedRateLimit,
}: EditSwapArgs): Promise<CompleteEditSwapDetails> {
  const swapInfo = await getPositionInfo(positionId);

  const baseAmount = notionalToBaseAmount(
    notional,
    swapInfo.quoteTokenDecimals,
    swapInfo.currentLiquidityIndex,
  );

  let fixedRateLimitRaw = ZERO_BN;
  if (fixedRateLimit !== undefined) {
    fixedRateLimitRaw = BigNumber.from(fixedRateToPrice(fixedRateLimit));
  }

  const params: CompleteEditSwapDetails = {
    ...swapInfo,
    owner: signer,
    baseAmount: baseAmount,
    margin: scale(swapInfo.quoteTokenDecimals)(margin),
    // todo: liquidator booster hard-coded
    liquidatorBooster: scale(swapInfo.quoteTokenDecimals)(0),
    fixedRateLimit: fixedRateLimitRaw,
  };

  return params;
}

export async function estimateEditSwapGasUnits({
  positionId,
  signer,
  notional,
  margin,
  fixedRateLimit,
}: EditSwapArgs): Promise<BigNumber> {
  const params = await createEditSwapParams({
    positionId,
    signer,
    notional,
    margin,
    fixedRateLimit,
  });

  const { data, value, chainId } = await getEditSwapTxData(params);
  const estimate = await estimateGas(signer, data, value, chainId);

  return estimate.gasLimit;
}

async function getEditSwapTxData(params: CompleteEditSwapDetails): Promise<{
  data: string;
  value: string;
  chainId: number;
}> {
  const chainId = await params.owner.getChainId();

  if (params.chainId !== chainId) {
    throw new Error('Chain id mismatch between pool and signer');
  }

  const swapPeripheryParams: EditSwapPeripheryParameters = {
    ...params,
    fixedRateLimit:
      params.fixedRateLimit !== undefined ? params.fixedRateLimit : ZERO_BN,
  };

  const { calldata: data, value } = await encodeSwap(
    swapPeripheryParams,
    params.accountId,
  );

  return {
    data,
    value,
    chainId,
  };
}
