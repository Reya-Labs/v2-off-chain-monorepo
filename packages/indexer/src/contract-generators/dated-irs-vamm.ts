import { ethers } from 'ethers';
import { SupportedChainId, getProvider } from '../services/provider';
import { getAddress } from './addresses';

export const getDatedIrsVammContract = (
  chainId: SupportedChainId,
): ethers.Contract => {

  const abi = [
    `event VammCreated(uint128 _marketId, int24 tick, (uint256 maturityTimestamp, uint128 _maxLiquidityPerTick, int24 _tickSpacing), (uint256 priceImpactPhi, uint256 priceImpactBeta, uint256 spread, address rateOracle))`,
  ];

  const provider = getProvider(chainId);
  const address = getAddress(chainId, 'dated_irs_vamm');

  const contract = new ethers.Contract(address, abi, provider);

  return contract;
};
