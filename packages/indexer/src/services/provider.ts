import { ethers } from 'ethers';
import { getAlchemyApiKey, getInfuraApiKey } from '../utils/env-vars';

export enum SupportedChainId {
  mainnet = 1,
  goerli = 5,
  arbitrum = 42161,
  arbitrumGoerli = 421613,
  avalanche = 43114,
  avalancheFuji = 43113,
}

const providerApiKeyToURL = (
  chainId: SupportedChainId,
  alchemyApiKey: string,
  infuraApiKey: string,
): string => {
  switch (chainId) {
    case SupportedChainId.mainnet: {
      return `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;
    }
    case SupportedChainId.goerli: {
      return `https://eth-goerli.g.alchemy.com/v2/${alchemyApiKey}`;
    }
    case SupportedChainId.arbitrum: {
      return `https://arb-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;
    }
    case SupportedChainId.arbitrumGoerli: {
      return `https://arb-goerli.g.alchemy.com/v2/${alchemyApiKey}`;
    }
    case SupportedChainId.avalanche: {
      return `https://avalanche-mainnet.infura.io/v3/${infuraApiKey}`;
    }
    case SupportedChainId.avalancheFuji: {
      return `https://avalanche-fuji.infura.io/v3/${infuraApiKey}`;
    }
  }
};

export const getProvider = (
  chainId: SupportedChainId,
): ethers.providers.JsonRpcProvider => {
  const providerURL = providerApiKeyToURL(
    chainId,
    getAlchemyApiKey(),
    getInfuraApiKey(),
  );
  return new ethers.providers.JsonRpcProvider(providerURL);
};
