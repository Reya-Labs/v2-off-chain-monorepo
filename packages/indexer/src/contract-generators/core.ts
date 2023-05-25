import { ethers } from 'ethers';
import { SupportedChainId, getProvider } from '../services/provider';
import { getAddress } from './addresses';

export const getCoreContract = (chainId: SupportedChainId): ethers.Contract => {
  const abi = [
    `event CollateralUpdate(uint128 indexed accountId, address indexed collateralType, int256 tokenAmount, uint256 blockTimestamp)`,
  ];

  const provider = getProvider(chainId);
  const address = getAddress(chainId, 'core');

  const contract = new ethers.Contract(address, abi, provider);

  return contract;
};
