import { BigNumber, ContractReceipt } from 'ethers';
import {
  estimateGas,
  executeTransaction,
  simulateTxExpectError,
  Transaction,
} from '../executeTransaction';
import { encodeSwap } from './encode';
import { CompleteSwapDetails, InfoPostSwap, SwapArgs } from './types';
import { getPoolInfo } from '../../gateway/getPoolInfo';
import { decodeSwap } from '../../utils/decodeOutput';
import { decodeImFromError } from '../../utils/errors/errorHandling';
import { processInfoPostSwap } from './processInfo';
import { ZERO_BN } from '../../utils/constants';
import { scale } from '@voltz-protocol/commons-v2/';

export async function swap({
  ammId,
  signer,
  notional,
  margin,
}: SwapArgs): Promise<ContractReceipt> {
  const params = await createSwapParams({
    ammId,
    signer,
    notional,
    margin,
  });

  const { calldata: data, value } = encodeSwap(params);
  const result = await executeTransaction(signer, data, value, params.chainId);
  return result;
}

export async function simulateSwap({
  ammId,
  signer,
  notional,
  margin,
}: SwapArgs): Promise<InfoPostSwap> {
  const params = await createSwapParams({
    ammId,
    signer,
    notional,
    margin,
  });

  const { calldata: data, value } = encodeSwap(params);

  let txData: Transaction & { gasLimit: BigNumber };
  let bytesOutput: any;
  let isError = false;
  try {
    const res = await simulateTxExpectError(
      signer,
      data,
      value,
      params.chainId,
    );

    txData = res.txData;
    bytesOutput = res.bytesOutput;
    isError = res.isError;
  } catch (e) {
    throw new Error('Failed to simulate swap');
  }

  const { executedBaseAmount, executedQuoteAmount, fee, im } = isError
    ? {
        executedBaseAmount: ZERO_BN,
        executedQuoteAmount: ZERO_BN,
        fee: ZERO_BN,
        im: decodeImFromError(bytesOutput).marginRequirement,
      }
    : decodeSwap(margin < 0 ? bytesOutput[2] : bytesOutput[3]);

  const result = await processInfoPostSwap(
    signer,
    executedBaseAmount,
    executedQuoteAmount,
    fee,
    im,
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
}: SwapArgs): Promise<BigNumber> {
  const params = await createSwapParams({
    ammId,
    signer,
    notional,
    margin,
  });

  const { calldata: data, value } = encodeSwap(params);
  const estimate = await estimateGas(signer, data, value, params.chainId);

  return estimate.gasLimit;
}

// HELPERS

async function createSwapParams({
  ammId,
  signer,
  notional,
  margin,
}: SwapArgs): Promise<CompleteSwapDetails> {
  const chainId = await signer.getChainId();
  const poolInfo = await getPoolInfo(ammId);

  if (poolInfo.chainId !== chainId) {
    throw new Error('Chain ids are different for pool and signer');
  }

  const baseAmount = notional / poolInfo.currentLiquidityIndex;

  const params: CompleteSwapDetails = {
    ...poolInfo,
    ownerAddress: await signer.getAddress(),
    baseAmount: scale(poolInfo.quoteTokenDecimals)(baseAmount),
    margin: scale(poolInfo.quoteTokenDecimals)(margin),
    // todo: liquidator booster hard-coded
    liquidatorBooster: scale(poolInfo.quoteTokenDecimals)(1),
  };

  console.log('swap params:', params);

  return params;
}
