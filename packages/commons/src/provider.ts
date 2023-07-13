// 1 - mainnet
// 5 - goerli
// 42161 - arbitrum
// 421613 - arbitrum goerli
// 43114 - avalanche
// 43113 - avalancheFuji

export type SupportedChainId = 1 | 5 | 42161 | 421613 | 43114 | 43113;

export const providerApiKeyToURL = (
  chainId: SupportedChainId,
  alchemyApiKey: string,
  infuraApiKey: string,
): string => {
  switch (chainId) {
    case 1: {
      return `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;
    }
    case 5: {
      return `https://eth-goerli.g.alchemy.com/v2/${alchemyApiKey}`;
    }
    case 42161: {
      return `https://arb-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;
    }
    case 421613: {
      return `https://arb-goerli.g.alchemy.com/v2/${alchemyApiKey}`;
    }
    case 43114: {
      return `https://avalanche-mainnet.infura.io/v3/${infuraApiKey}`;
    }
    case 43113: {
      return `https://avalanche-fuji.infura.io/v3/${infuraApiKey}`;
    }
    default: {
      chainId satisfies never;
    }
  }

  throw new Error(`Chain ID ${chainId} is not recognized`);
};
