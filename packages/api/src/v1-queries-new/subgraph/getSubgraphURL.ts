export enum SupportedChainId {
  mainnet = 1,
  goerli = 5,
  arbitrum = 42161,
  arbitrumGoerli = 421613,
  avalanche = 43114,
  avalancheFuji = 43113,
}

const CHAIN_SUBGRAPH_URL_MAP: Record<SupportedChainId, string> = {
  [SupportedChainId.mainnet]:
    'https://api.thegraph.com/subgraphs/name/voltzprotocol/mainnet-v1',
  [SupportedChainId.goerli]:
    'https://api.thegraph.com/subgraphs/name/voltzprotocol/voltz-goerli',
  [SupportedChainId.arbitrum]:
    'https://api.thegraph.com/subgraphs/name/voltzprotocol/arbitrum-v1',
  [SupportedChainId.arbitrumGoerli]:
    'https://api.thegraph.com/subgraphs/name/voltzprotocol/arbitrum-goerli-v1',
  [SupportedChainId.avalanche]:
    'https://api.thegraph.com/subgraphs/name/voltzprotocol/avalanche-v1',
  [SupportedChainId.avalancheFuji]:
    'https://api.thegraph.com/subgraphs/name/voltzprotocol/ava-fuji-v1',
};

export const getSubgraphURL = (chainId: SupportedChainId): string => {
  return CHAIN_SUBGRAPH_URL_MAP[chainId] || '';
};
