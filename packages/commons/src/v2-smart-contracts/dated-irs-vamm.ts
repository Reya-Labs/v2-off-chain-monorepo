import { ethers } from 'ethers';
import { getAddress } from './addresses';
import { SupportedChainId, getProvider } from '../provider';

export const getDatedIrsVammContract = (
  chainId: SupportedChainId,
): ethers.Contract => {
  const abi = [
    `event VammCreated(uint128 marketId, int24 tick, (uint32 maturityTimestamp, uint128 maxLiquidityPerTick, int24 tickSpacing, uint128 marketId) config, (uint256 priceImpactPhi, uint256 priceImpactBeta, uint256 spread, address rateOracle) mutableConfig, uint256 blockTimestamp)`,
    `event VammConfigUpdated(uint128 marketId, (uint256 priceImpactPhi, uint256 priceImpactBeta, uint256 spread, address rateOracle) config, uint256 blockTimestamp)`,
    `event VammPriceChange(uint128 indexed marketId, uint32 indexed maturityTimestamp, int24 tick, uint256 blockTimestamp)`,
    `event LiquidityChange(uint128 marketId, uint32 maturityTimestamp, address sender, uint128 indexed accountId, int24 indexed tickLower, int24 indexed tickUpper, int128 liquidityDelta,uint256 blockTimestamp)`,
  ];

  const provider = getProvider(chainId);
  const address = getAddress(chainId, 'dated_irs_vamm');

  const contract = new ethers.Contract(address, abi, provider);

  return contract;
};
