import { Contract, Signer, providers } from 'ethers';
import { getAddress } from '../addresses';
import { getABI } from './ABIs/getABI';

export const getCoreContract = (
  chainId: number,
  subject: providers.JsonRpcProvider | Signer,
): Contract => {
  const address = getAddress(chainId, 'core');

  const contract = new Contract(address, getABI(), subject);

  return contract;
};
