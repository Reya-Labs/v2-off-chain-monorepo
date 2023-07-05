import { BigNumber } from 'ethers';
import { estimateGas } from '../executeTransaction';
import { encodeSwap } from './encode';
import { CompleteSwapDetails } from './types';

export async function commonEstimateSwapGasUnits(
  params: CompleteSwapDetails,
): Promise<BigNumber> {
  const { calldata: data, value } = encodeSwap(params);
  const estimate = await estimateGas(
    params.signer,
    data,
    value,
    params.chainId,
  );

  return estimate.gasLimit;
}
