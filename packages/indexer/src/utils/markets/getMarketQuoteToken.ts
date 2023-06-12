/*
  When parsing an action event, marketId is passed but we need to find the quote token of the market.
  This information should be stored in the Markets Table. 
  However, to speed up the process, we should be able to use Redis to cache it.

  We can also pass this information in the event body as well. 
  However, there are some events that are emitted in functions that do not have it.
  Hence, to avoid an external call (to fetch quoteToken) on the smart contract-generators, we infer it here, off-chain.
*/
export const getMarketQuoteToken = (marketId: string): string => {
  // todo: implement this function
  return '0xa0b86991c6218b36c1d19D4a2e9eb0ce3606eb48';
};
