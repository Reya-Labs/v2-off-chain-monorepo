import { SupportedChainId } from '../provider';

const chainNativeTokens: Record<SupportedChainId, 'ETH' | 'AVAX'> = {
  [SupportedChainId.mainnet]: 'ETH',
  [SupportedChainId.goerli]: 'ETH',
  [SupportedChainId.arbitrum]: 'ETH',
  [SupportedChainId.arbitrumGoerli]: 'ETH',
  [SupportedChainId.avalanche]: 'AVAX',
  [SupportedChainId.avalancheFuji]: 'AVAX',
};

export const getNativeGasToken = (
  chainId: SupportedChainId,
): 'ETH' | 'AVAX' => {
  return chainNativeTokens[chainId];
};
