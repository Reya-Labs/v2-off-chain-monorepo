import { ethers } from 'ethers';
import { getAddress } from './addresses';
import { SupportedChainId, getProvider } from '../provider';

export const getCoreContract = (chainId: SupportedChainId): ethers.Contract => {
  const abi = [``];

  const provider = getProvider(chainId);
  const address = getAddress(chainId, 'core');

  const contract = new ethers.Contract(address, abi, provider);

  return contract;
};
