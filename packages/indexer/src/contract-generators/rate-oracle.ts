import { SupportedChainId, getProvider } from '@voltz-protocol/commons-v2';
import { ethers } from 'ethers';

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
