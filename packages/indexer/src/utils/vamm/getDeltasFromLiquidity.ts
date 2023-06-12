import { tickToSqrtPrice } from './tickConversions';

export const getDeltasFromLiquidity = (
  liquidity: number,
  tickLower: number,
  tickUpper: number,
): {
  absBaseDelta: number;
  absQuoteDelta: number;
} => {
  console.log(
    'args of getDeltasFromLiquidity:',
    liquidity,
    tickLower,
    tickUpper,
  );

  const sqrtPriceLow = tickToSqrtPrice(tickLower);
  const sqrtPriceHigh = tickToSqrtPrice(tickUpper);

  console.log('sqrts:', sqrtPriceLow, sqrtPriceHigh);

  const absBaseDelta = liquidity * (sqrtPriceHigh - sqrtPriceLow);
  const absQuoteDelta =
    (liquidity * (sqrtPriceHigh - sqrtPriceLow)) / sqrtPriceHigh / sqrtPriceLow;

  console.log('deltas:', absBaseDelta, absQuoteDelta);

  return {
    absBaseDelta,
    absQuoteDelta,
  };
};
