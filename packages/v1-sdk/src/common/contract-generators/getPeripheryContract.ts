import { ethers, Signer } from 'ethers';

export const getPeripheryContract = (
  peripheryAddress: string,
  provider: ethers.providers.Provider,
): ethers.Contract => {
  // todo: needs to be tested separately
  const abi: string[] = [
    `
    function swap(address, bool, uint256, uint160, int24, int24, int256) external payable returns (int256,int256,uint256,int256,int256,int24,int256)
    `,
    `
    function mintOrBurn(address, int24, int24, uint256, bool, int256) external payable returns (int256)
    `,
  ];

  const contract: ethers.Contract = new ethers.Contract(
    peripheryAddress,
    abi,
    provider,
  );

  return contract;
};
