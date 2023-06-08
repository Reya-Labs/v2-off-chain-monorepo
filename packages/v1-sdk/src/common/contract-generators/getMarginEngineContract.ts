import { ethers } from 'ethers';

export const getMarginEngineContract = (
  marginEngineAddress: string,
  providerOrSigner: ethers.providers.Provider | ethers.Signer,
): ethers.Contract => {
  const abi: string[] = [
    `
    function getPosition(address, int24, int24) external returns (bool, uint128, int256, int256, int256, int256, int256, uint256, uint256, uint256)
    `,
  ];

  const contract: ethers.Contract = new ethers.Contract(
    marginEngineAddress,
    abi,
    providerOrSigner,
  );

  return contract;
};
