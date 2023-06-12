import { tickToSqrtPrice } from './tickConversions';

export const getDeltasFromLiquidity = (
  liquidity: number,
  tickLower: number,
  tickUpper: number,
): {
  absBaseDelta: number;
  absQuoteDelta: number;
} => {
  const sqrtPriceLow = tickToSqrtPrice(tickLower);
  const sqrtPriceHigh = tickToSqrtPrice(tickUpper);

  return {
    absBaseDelta: liquidity * (sqrtPriceHigh - sqrtPriceLow),
    absQuoteDelta:
      (liquidity * (sqrtPriceHigh - sqrtPriceLow)) /
      sqrtPriceHigh /
      sqrtPriceLow,
  };
};
