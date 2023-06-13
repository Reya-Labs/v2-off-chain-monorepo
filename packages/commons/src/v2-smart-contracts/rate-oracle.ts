import { ethers } from 'ethers';
import { SupportedChainId, getProvider } from '../provider';

export const getRateOracleContract = (
  chainId: SupportedChainId,
  address: string,
): ethers.Contract => {
  const abi = [
    'function getCurrentRateInRay() external view returns (uint256)',
  ];

  const provider = getProvider(chainId);
  const contract = new ethers.Contract(address, abi, provider);

  return contract;
};
