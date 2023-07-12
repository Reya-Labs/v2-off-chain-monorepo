// todo: to be extended
export const getMarketQuoteToken = (
  chainId: number,
  marketId: string,
): string => {
  if (chainId === 421613 && marketId === '1') {
    return '0x72a9c57cd5e2ff20450e409cf6a542f1e6c710fc';
  }

  return '0xa0b86991c6218b36c1d19D4a2e9eb0ce3606eb48';
};
