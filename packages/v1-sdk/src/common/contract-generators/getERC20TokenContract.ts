import { ethers } from 'ethers';

export const getERC20TokenContract = (
  tokenAddress: string,
  providerOrSigner: ethers.providers.Provider | ethers.Signer,
): ethers.Contract => {
  const abi: string[] = [
    `
    function approve(address, uint256) external returns (bool)
    `,
  ];

  const contract: ethers.Contract = new ethers.Contract(
    tokenAddress,
    abi,
    providerOrSigner,
  );

  return contract;
};
