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
import { getEditSwapPeripheryParams } from './getEditSwapPeripheryParams';
import { getTokenDetails, scale } from '@voltz-protocol/commons-v2';
import {
  baseAmountToNotionalBN,
  notionalToBaseAmount,
} from '../../utils/helpers';
import { VERY_BIG_NUMBER, ZERO_BN } from '../../utils/constants';
import { fixedRateToPrice } from '../../utils/math/tickHelpers';
import { decodeSwapOutput, InfoPostSwap, processInfoPostSwap } from '../swap';

async function createEditSwapParams({
  poolId,
  positionId,
  signer,
  notionalAmount,
  marginAmount,
  priceLimit,
}: EditSwapArgs): Promise<CompleteEditSwapDetails> {
  const swapInfo = await getEditSwapPeripheryParams(poolId, positionId);

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

  const params: CompleteEditSwapDetails = {
    ...swapInfo,
    owner: signer,
    baseAmount: baseAmount,
    marginAmount: scale(tokenDecimals)(marginAmount),
    priceLimit: priceLimitRaw,
  };

  return params;
}

export async function editSwap({
  poolId,
  positionId,
  signer,
  notionalAmount,
  marginAmount,
  priceLimit,
}: EditSwapArgs): Promise<ContractReceipt> {
  // fetch: send request to api

  const params = await createEditSwapParams({
    poolId,
    positionId,
    signer,
    notionalAmount,
    marginAmount,
    priceLimit,
  });

  const { data, value, chainId } = await getEditSwapTxData(params);
  const result = await executeTransaction(signer, data, value, chainId);
  return result;
}

export async function getInfoPostEditSwap({
  poolId,
  positionId,
  signer,
  notionalAmount,
  marginAmount,
  priceLimit,
}: EditSwapArgs): Promise<InfoPostSwap> {
  const params = await createEditSwapParams({
    poolId,
    positionId,
    signer,
    notionalAmount,
    marginAmount,
    priceLimit,
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
    decodeSwapOutput(bytesOutput);

  // SIMULATE WITH MAX NOTIONAL

  let availableNotionalRaw = ZERO_BN;
  {
    const { data, value, chainId } = await getEditSwapTxData({
      ...params,
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
    params.positionMargin,
  );

  return result;
}

export async function estimateEditSwapGasUnits({
  poolId,
  positionId,
  signer,
  notionalAmount,
  marginAmount,
  priceLimit,
}: EditSwapArgs): Promise<BigNumber> {
  const params = await createEditSwapParams({
    poolId,
    positionId,
    signer,
    notionalAmount,
    marginAmount,
    priceLimit,
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
  const swapPeripheryParams: EditSwapPeripheryParameters = {
    ...params,
    priceLimit: params.priceLimit !== undefined ? params.priceLimit : ZERO_BN,
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
