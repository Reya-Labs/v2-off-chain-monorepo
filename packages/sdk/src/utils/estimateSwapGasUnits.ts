export enum SupportedChainId {
  mainnet = 1,
  goerli = 5,
  arbitrum = 42161,
  arbitrumGoerli = 421613,
  avalanche = 43114,
  avalancheFuji = 43113,
  spruce = 424242,
}

const CHAIN_SWAP_GAS_UNITS_MAP: Record<SupportedChainId, number> = {
  [SupportedChainId.mainnet]: 550000,
  [SupportedChainId.goerli]: 550000,
  [SupportedChainId.arbitrum]: 1500000,
  [SupportedChainId.arbitrumGoerli]: 1500000,
  [SupportedChainId.avalanche]: 650000,
  [SupportedChainId.avalancheFuji]: 650000,
  [SupportedChainId.spruce]: 650000, // todo spruce: confirm this
};

export function estimateAnyTradeGasUnits(chainId: SupportedChainId): number {
  return CHAIN_SWAP_GAS_UNITS_MAP[chainId] || -1;
}
