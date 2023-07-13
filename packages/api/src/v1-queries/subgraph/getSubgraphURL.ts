import { SupportedChainId } from '@voltz-protocol/commons-v2';

const CHAIN_SUBGRAPH_URL_MAP: Record<SupportedChainId, string> = {
  [1]: 'https://api.thegraph.com/subgraphs/name/voltzprotocol/mainnet-v1',
  [5]: 'https://api.thegraph.com/subgraphs/name/voltzprotocol/voltz-goerli',
  [42161]: 'https://api.thegraph.com/subgraphs/name/voltzprotocol/arbitrum-v1',
  [421613]:
    'https://api.thegraph.com/subgraphs/name/voltzprotocol/arbitrum-goerli-v1',
  [43114]: 'https://api.thegraph.com/subgraphs/name/voltzprotocol/avalanche-v1',
  [43113]: 'https://api.thegraph.com/subgraphs/name/voltzprotocol/ava-fuji-v1',
};

export const getSubgraphURL = (chainId: number): string => {
  // todo: add check for chainId to be SupportedChainId
  return CHAIN_SUBGRAPH_URL_MAP[chainId as SupportedChainId] || '';
};
