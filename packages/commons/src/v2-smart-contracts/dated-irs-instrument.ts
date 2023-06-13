import { ethers } from 'ethers';
import { getAddress } from './addresses';
import { SupportedChainId, getProvider } from '../provider';

export const getDatedIrsInstrumentContract = (
  chainId: SupportedChainId,
): ethers.Contract => {
  const abi = [``];

  const provider = getProvider(chainId);
  const address = getAddress(chainId, 'dated_irs_instrument');

  const contract = new ethers.Contract(address, abi, provider);

  return contract;
};
