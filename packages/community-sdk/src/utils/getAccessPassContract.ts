import { ethers } from 'ethers';

export const getAccessPassContract = (
  address: string,
  providerOrSigner: ethers.providers.Provider | ethers.Signer,
): ethers.Contract => {
  const abi: string[] = [
    `
    function redeem(address, uint256, bytes32[], bytes32) public returns (uint256[])
    `,
    `
    function balanceOf(address) public view returns (uint256)
    `,
  ];

  const contract: ethers.Contract = new ethers.Contract(
    address,
    abi,
    providerOrSigner,
  );

  return contract;
};