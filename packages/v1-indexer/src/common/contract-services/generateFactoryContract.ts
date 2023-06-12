import { ethers } from 'ethers';

export const generateFactoryContract = (
  address: string,
  provider: ethers.providers.Provider,
): ethers.Contract => {
  const abi = [
    `event IrsInstance(
      address indexed underlyingToken,
      address indexed rateOracle,
      uint256 termStartTimestampWad,
      uint256 termEndTimestampWad,
      int24 tickSpacing,
      address marginEngine,
      address vamm,
      address fcm,
      uint8 yieldBearingProtocolID,
      uint8 underlyingTokenDecimals
  )`,
  ];

  const contract = new ethers.Contract(address, abi, provider);

  return contract;
};
