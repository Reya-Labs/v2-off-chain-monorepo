import { SupportedChainId } from '@voltz-protocol/commons-v2';

const CHAIN_SWAP_GAS_UNITS_MAP: Record<SupportedChainId, number> = {
  [1]: 550000,
  [5]: 550000,
  [42161]: 1500000,
  [421613]: 1500000,
  [43114]: 650000,
  [43113]: 650000,
};

export function estimateAnyTradeGasUnits(chainId: number): number {
  // todo: add check for chainId to be SupportedChainId
  return CHAIN_SWAP_GAS_UNITS_MAP[chainId as SupportedChainId];
}
