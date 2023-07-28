import { Contract, Signer, providers } from 'ethers';

export const getMockXRateOracleContract = (
  subject: providers.JsonRpcProvider | Signer,
  address: string,
): Contract => {
  const abi: string[] = [
    `function getCurrentRateInRay() external view returns (uint256)`,
    'function getCurrentIndex() external view returns (uint256)',
    'function xChainId() external view returns (uint256)',
    'function xRateOracleAddress() external view returns (address)',
    'function mockIndex(uint256 liquidityIndex)',
  ];

  const contract = new Contract(address, abi, subject);

  return contract;
};
