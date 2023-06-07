import { ethers, Signer } from 'ethers';

export const getPeripheryContract = (
  peripheryAddress: string,
  provider: ethers.providers.Provider,
): ethers.Contract => {
  const abi: string[] = [
    `
    function swap(address, bool, uint256, uint160, int24, int24, int256) external payable returns (int256,int256,uint256,int256,int256,int24,int256)
    `,
    `
    function mintOrBurn(address, int24, int24, uint256, bool, int256) external payable returns (int256)
    `,
    `
    function settlePositionAndWithdrawMargin(address, address, int24, int24) external
    `,
    `
    function rolloverWithMint(address, address, int24, int24, address, int24, int24, uint256, bool, int256) external
    `,
    `
    function rolloverWithSwap(address, address, int24, int24, address, bool, uint256, uint160, int24, int24, int256) external
    `,
    `
    function updatePositionMargin(address, int24, int24, int256, bool)
    `,
  ];

  const contract: ethers.Contract = new ethers.Contract(
    peripheryAddress,
    abi,
    provider,
  );

  return contract;
};
