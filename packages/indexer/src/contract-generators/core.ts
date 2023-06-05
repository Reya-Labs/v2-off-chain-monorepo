import { ethers } from 'ethers';
import { SupportedChainId, getProvider } from '../services/provider';
import { getAddress } from './addresses';

export const getCoreContract = (chainId: SupportedChainId): ethers.Contract => {
  const abi = [``];

  const provider = getProvider(chainId);
  const address = getAddress(chainId, 'core');

  const contract = new ethers.Contract(address, abi, provider);

  return contract;
};
