import { getTokenPriceInUSD } from './getTokenPriceInUSD';

export async function getTotalAmountInUSD(
  rows: {
    amount: number;
    underlyingToken: string;
  }[],
  coingeckoApiKey: string,
) {
  let totalInUSD = 0;

  for (const { amount, underlyingToken } of rows) {
    const priceInUSD = await getTokenPriceInUSD(
      underlyingToken,
      coingeckoApiKey,
    );
    totalInUSD += amount * priceInUSD;
  }

  return totalInUSD;
}
