export const getMarketQuoteToken = (
  chainId: number,
  marketId: string,
): string => {
  if (marketId === '1' && chainId === 421613) {
    return '0x72a9c57cd5e2ff20450e409cf6a542f1e6c710fc';
  }

  // todo: track
  throw new Error(
    `Market ${chainId}-${marketId} does not have corresponding quote token.`,
  );
};
