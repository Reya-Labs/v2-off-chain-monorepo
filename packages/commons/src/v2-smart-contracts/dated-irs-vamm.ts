import { ethers } from 'ethers';
import { getAddress } from './addresses';
import { SupportedChainId, getProvider } from '../provider';

export const getDatedIrsVammContract = (
  chainId: SupportedChainId,
): ethers.Contract => {
  const abi = [
    `event VammCreated(uint128 marketId, int24 tick, (uint256 maturityTimestamp, uint128 maxLiquidityPerTick, int24 tickSpacing), (uint256 priceImpactPhi, uint256 priceImpactBeta, uint256 spread, address rateOracle))`,
    `event VammPriceChange(uint128 marketId, uint32 maturityTimestamp, int24 tick)`,
  ];

  const provider = getProvider(chainId);
  const address = getAddress(chainId, 'dated_irs_vamm');

  const contract = new ethers.Contract(address, abi, provider);

  return contract;
};
