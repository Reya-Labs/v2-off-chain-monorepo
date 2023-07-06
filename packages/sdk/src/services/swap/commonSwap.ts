import { ContractReceipt } from 'ethers';
import { executeTransaction } from '../executeTransaction';
import { encodeSwap } from './encode';
import { CompleteSwapDetails } from './types';

export async function commonSwap(
  params: CompleteSwapDetails,
): Promise<ContractReceipt> {
  const { calldata: data, value } = encodeSwap(params);
  const result = await executeTransaction(
    params.signer,
    data,
    value,
    params.chainId,
  );
  return result;
}
