import { BigNumber, ContractReceipt } from 'ethers';
import {
  estimateGas,
  executeTransaction,
  simulateTx,
} from '../executeTransaction';
import { encodeSwap } from '../swap/encode';
import { CompleteEditSwapDetails, EditSwapArgs } from './types';
import { getPositionInfo } from '../../gateway/getPositionInfo';
import { decodeSwap } from '../../utils/decodeOutput';
import { InfoPostSwap } from '../swap/types';
import { processInfoPostSwap } from '../swap/processInfo';
import { scale } from '@voltz-protocol/commons-v2';

export async function editSwap({
  positionId,
  signer,
  notional,
  margin,
}: EditSwapArgs): Promise<ContractReceipt> {
  const params = await createEditSwapParams({
    positionId,
    signer,
    notional,
    margin,
  });

  const { calldata: data, value } = encodeSwap(params, params.accountId);
  const result = await executeTransaction(signer, data, value, params.chainId);
  return result;
}

export async function simulateEditSwap({
  positionId,
  signer,
  notional,
  margin,
}: EditSwapArgs): Promise<InfoPostSwap> {
  const params = await createEditSwapParams({
    positionId,
    signer,
    notional,
    margin,
  });

  // SIMULATE TX

  const { calldata: data, value } = encodeSwap(params, params.accountId);
  const { txData, bytesOutput } = await simulateTx(
    signer,
    data,
    value,
    params.chainId,
  );

  const { executedBaseAmount, executedQuoteAmount, fee, im, currentTick } =
    decodeSwap(bytesOutput, false, margin < 0, margin > 0, notional > 0);

  const result = await processInfoPostSwap(
    signer,
    executedBaseAmount,
    executedQuoteAmount,
    fee,
    im,
    currentTick,
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
}: EditSwapArgs): Promise<CompleteEditSwapDetails> {
  const swapInfo = await getPositionInfo(positionId);

  const baseAmount = notional / swapInfo.currentLiquidityIndex;

  const params: CompleteEditSwapDetails = {
    ...swapInfo,
    ownerAddress: await signer.getAddress(),
    baseAmount: scale(swapInfo.quoteTokenDecimals)(baseAmount),
    margin: scale(swapInfo.quoteTokenDecimals)(margin),
    // todo: liquidator booster hard-coded
    liquidatorBooster: scale(swapInfo.quoteTokenDecimals)(0),
  };

  console.log('edit swap params:', params);

  return params;
}

export async function estimateEditSwapGasUnits({
  positionId,
  signer,
  notional,
  margin,
}: EditSwapArgs): Promise<BigNumber> {
  const params = await createEditSwapParams({
    positionId,
    signer,
    notional,
    margin,
  });

  const { calldata: data, value } = encodeSwap(params, params.accountId);
  const estimate = await estimateGas(signer, data, value, params.chainId);

  return estimate.gasLimit;
}
