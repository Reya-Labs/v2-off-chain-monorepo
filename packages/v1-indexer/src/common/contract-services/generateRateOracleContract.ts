import { ethers } from 'ethers';

export const generateRateOracleContract = (
  address: string,
  provider: ethers.providers.Provider,
): ethers.Contract => {
  const abi = [
    `function variableFactor(uint256 termStartTimestamp, uint256 termEndTimestamp) external returns(uint256 result)`,
    `function getCurrentRateInRay() external view returns (uint256 currentRate)`,
    `function aaveLendingPool() external view returns (address)`,
    `function ctoken() external view returns (address)`,
    `function underlying() external view returns (address)`,
  ];

  const contract = new ethers.Contract(address, abi, provider);

  return contract;
};
