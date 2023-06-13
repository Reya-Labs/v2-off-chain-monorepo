import { tickToSqrtPrice } from './tickConversions';

export const getTokensFromLiquidity = (
  liquidity: number,
  tickLower: number,
  tickUpper: number,
): {
  absVariableTokenDelta: number;
  absUnbalancedFixedTokenDelta: number;
} => {
  const sqrtPriceLow = tickToSqrtPrice(tickLower);
  const sqrtPriceHigh = tickToSqrtPrice(tickUpper);

  return {
    absVariableTokenDelta: liquidity * (sqrtPriceHigh - sqrtPriceLow),
    absUnbalancedFixedTokenDelta:
      (liquidity * (sqrtPriceHigh - sqrtPriceLow)) /
      sqrtPriceHigh /
      sqrtPriceLow,
  };
};
