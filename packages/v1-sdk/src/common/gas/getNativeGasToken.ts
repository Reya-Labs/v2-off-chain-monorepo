import { providers } from 'ethers';
import { SupportedChainId } from '../types';

const CHAIN_TOKEN_MAP: Record<SupportedChainId, 'ETH' | 'AVAX'> = {
  [SupportedChainId.mainnet]: 'ETH',
  [SupportedChainId.goerli]: 'ETH',
  [SupportedChainId.arbitrum]: 'ETH',
  [SupportedChainId.arbitrumGoerli]: 'ETH',
  [SupportedChainId.avalanche]: 'AVAX',
  [SupportedChainId.avalancheFuji]: 'AVAX',
};
export async function getNativeGasToken(provider: providers.Provider): Promise<'ETH' | 'AVAX'> {
  let chainId: SupportedChainId | null = null;

  const attempts = 5;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      chainId = (await provider.getNetwork()).chainId as SupportedChainId;
      break;
    } catch (error) {
      if (attempt + 1 === attempts) {
        // todo: bring back sentry
        throw error;
      }
    }
  }

  if (!chainId) {
    throw Error('Cannot detect chain id');
  }

  if (CHAIN_TOKEN_MAP[chainId]) {
    return CHAIN_TOKEN_MAP[chainId];
  }

  throw Error(`Unsupported chain id ${chainId}`);
}