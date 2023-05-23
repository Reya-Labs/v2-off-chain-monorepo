import { ethers, Signer } from "ethers";

export const getPeripheryContract =  (
  peripheryAddress: string,
  provider: ethers.providers.Provider
): ethers.Contract => {
  // todo: only bring the relevant abi
  const abi = [
    ``
  ];

  const contract: ethers.Contract = new ethers.Contract(peripheryAddress, abi, provider);

  return contract;

}