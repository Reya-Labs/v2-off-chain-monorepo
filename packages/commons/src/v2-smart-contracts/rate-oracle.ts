import { Contract, Signer, providers } from 'ethers';

export const getRateOracleContract = (
  subject: providers.JsonRpcProvider | Signer,
  address: string,
): Contract => {
  const abi: string[] = [
    `function getCurrentRateInRay() external view returns (uint256)`,
    'function getCurrentIndex() external view returns (uint256)',
    'function hasState() external pure returns (bool)',
    'function earliestStateUpdate() external view returns (uint256)',
    'function updateState() external',
  ];

  const contract = new Contract(address, abi, subject);

  return contract;
};
