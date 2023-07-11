import { Signer, ethers, providers } from 'ethers';
import { SupportedChainId } from '../provider';
import { getAddress } from './addresses';

export const getAlphaPassContract = (
  chainId: SupportedChainId,
  subject: providers.JsonRpcProvider | Signer,
): ethers.Contract => {
  const abi: string[] = [
    `function redeem(address, uint256, bytes32[], bytes32) public returns (uint256[])`,
    `function balanceOf(address) public view returns (uint256)`,
    `function ownerOf(uint256) public view returns (address)`,
  ];

  const address = getAddress(chainId, 'alpha_pass');

  const contract: ethers.Contract = new ethers.Contract(address, abi, subject);

  return contract;
};
