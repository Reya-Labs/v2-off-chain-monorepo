import { Contract, Signer, providers } from 'ethers';
import { getAddress } from './addresses';

export const getDatedIrsVammContract = (
  chainId: number,
  subject: providers.JsonRpcProvider | Signer,
): Contract => {
  const abi = [
    `event VammCreated(uint128 marketId, int24 tick, (uint32 maturityTimestamp, uint128 maxLiquidityPerTick, int24 tickSpacing, uint128 marketId) config, (uint256 priceImpactPhi, uint256 priceImpactBeta, uint256 spread, address rateOracle) mutableConfig, uint256 blockTimestamp)`,
    `event VammCreated(uint128 marketId, int24 tick, (uint32 maturityTimestamp, uint128 maxLiquidityPerTick, int24 tickSpacing, uint128 marketId) config, (uint256 priceImpactPhi, uint256 priceImpactBeta, uint256 spread, address rateOracle, int24 minTick, int24 maxTick) mutableConfig, uint256 blockTimestamp)`,

    `event VammConfigUpdated(uint128 marketId, uint32 maturityTimestamp, (uint256 priceImpactPhi, uint256 priceImpactBeta, uint256 spread, address rateOracle, int24 minTick, int24 maxTick) mutableConfig, uint256 blockTimestamp)`,
    `event VAMMPriceChange(uint128 indexed marketId, uint32 indexed maturityTimestamp, int24 tick, uint256 blockTimestamp)`,
    `event LiquidityChange(uint128 marketId, uint32 maturityTimestamp, address sender, uint128 indexed accountId, int24 indexed tickLower, int24 indexed tickUpper, int128 liquidityDelta,uint256 blockTimestamp)`,
  ];

  const address = getAddress(chainId, 'dated_irs_vamm');

  const contract = new Contract(address, abi, subject);

  return contract;
};
