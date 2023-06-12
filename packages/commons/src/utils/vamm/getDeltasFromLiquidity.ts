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

  const absBaseDelta = liquidity * (sqrtPriceHigh - sqrtPriceLow);
  const absQuoteDelta =
    (liquidity * (sqrtPriceHigh - sqrtPriceLow)) / sqrtPriceHigh / sqrtPriceLow;

  return {
    absBaseDelta,
    absQuoteDelta,
  };
};
