import { ethers } from 'ethers';
import { getAddress } from './addresses';
import { SupportedChainId, getProvider } from '@voltz-protocol/commons-v2';

export const getCoreContract = (chainId: SupportedChainId): ethers.Contract => {
  const abi = [``];

  const provider = getProvider(chainId);
  const address = getAddress(chainId, 'core');

  const contract = new ethers.Contract(address, abi, provider);

  return contract;
};
