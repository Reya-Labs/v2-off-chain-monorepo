import { BigNumber } from 'ethers';
import { estimateGas } from '../executeTransaction';
import { encodeLp } from './encode';
import { CompleteLpDetails } from './types';

export async function commonEstimateLpGasUnits(
  params: CompleteLpDetails,
): Promise<BigNumber> {
  const { calldata: data, value } = encodeLp(params);
  const estimate = await estimateGas(
    params.signer,
    data,
    value,
    params.chainId,
  );

  return estimate.gasLimit;
}
