import { SupportedChainId } from './provider';

const TestNetMap: Record<SupportedChainId, boolean> = {
  1: false,
  5: true,
  42161: false,
  421613: true,
  43114: false,
  43113: true,
};

export const isTestnet = (chainId: SupportedChainId) => TestNetMap[chainId];
