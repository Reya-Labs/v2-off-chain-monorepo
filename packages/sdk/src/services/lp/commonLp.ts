import { ContractReceipt } from 'ethers';
import { executeTransaction } from '../executeTransaction';
import { encodeLp } from './encode';
import { CompleteLpDetails } from './types';

export const commonLp = async (
  params: CompleteLpDetails,
): Promise<ContractReceipt> => {
  const { calldata: data, value } = encodeLp(params);

  const result = await executeTransaction(
    params.signer,
    data,
    value,
    params.chainId,
  );

  return result;
};
