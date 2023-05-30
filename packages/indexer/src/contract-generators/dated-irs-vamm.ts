import { ethers } from 'ethers';
import { SupportedChainId, getProvider } from '../services/provider';
import { getAddress } from './addresses';

export const getDatedIrsVammContract = (
  chainId: SupportedChainId,
): ethers.Contract => {
  const abi = [``];

  const provider = getProvider(chainId);
  const address = getAddress(chainId, 'dated_irs_vamm');

  const contract = new ethers.Contract(address, abi, provider);

  return contract;
};
