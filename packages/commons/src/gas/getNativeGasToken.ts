import { SupportedChainId } from '../provider';

const chainNativeTokens: Record<SupportedChainId, 'ETH' | 'AVAX'> = {
  [1]: 'ETH',
  [5]: 'ETH',
  [42161]: 'ETH',
  [421613]: 'ETH',
  [43114]: 'AVAX',
  [43113]: 'AVAX',
};

export const getNativeGasToken = (chainId: number): 'ETH' | 'AVAX' => {
  // todo: add check for chainId to be SupportedChainId
  return chainNativeTokens[chainId as SupportedChainId];
};
