import { getETHPriceInUSD } from './getETHPriceInUSD';

export const getTokenPriceInUSD = async (
  caseSensitiveTokenName: string,
  coingeckoApiKey: string,
): Promise<number> => {
  const tokenName = caseSensitiveTokenName.toUpperCase();

  switch (tokenName) {
    case 'USDC':
    case 'DAI':
    case 'USDT':
    case 'VUSD': {
      return 1;
    }
    case 'ETH': {
      return getETHPriceInUSD(coingeckoApiKey);
    }
    default: {
      throw new Error(`Could not fetch price for ${tokenName}.`);
    }
  }
};
