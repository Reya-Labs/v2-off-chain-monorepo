import { Contract, providers } from 'ethers';

export const getRateOracleContract = (
  provider: providers.JsonRpcProvider,
  address: string,
): Contract => {
  const abi: string[] = [
    `function getCurrentRateInRay() external view returns (uint256)`,
    'function getCurrentIndex() external view returns (uint256)',
  ];

  const contract = new Contract(address, abi, provider);

  return contract;
};
