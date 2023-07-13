export const getMarketProtocolId = (marketId: string): number => {
  if (marketId === '1') {
    return 7;
  }

  // todo: track
  throw new Error(
    `Market ID ${marketId} does not have corresponding protocol ID.`,
  );
};
