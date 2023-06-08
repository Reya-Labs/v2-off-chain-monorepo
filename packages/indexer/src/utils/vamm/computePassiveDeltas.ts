import { getDeltasFromLiquidity } from './getDeltasFromLiquidity';

type Args = {
  liquidity: number;
  tickMove: {
    from: number;
    to: number;
  };
  tickRange: {
    lower: number;
    upper: number;
  };
};

type Response = {
  baseDelta: number;
  quoteDelta: number;
};

export const computePassiveDeltas = ({
  liquidity,
  tickMove,
  tickRange,
}: Args): Response => {
  if (tickMove.from === tickMove.to) {
    return {
      baseDelta: 0,
      quoteDelta: 0,
    };
  }

  const isVT = tickMove.to > tickMove.from;

  let tradedLower = Math.min(tickMove.from, tickMove.to);
  let tradedUpper = Math.max(tickMove.from, tickMove.to);

  // no overlap, LP is not affected by this trade
  if (tradedLower >= tickRange.upper || tradedUpper <= tickRange.lower) {
    return {
      baseDelta: 0,
      quoteDelta: 0,
    };
  }

  tradedLower = Math.max(tradedLower, tickRange.lower);
  tradedUpper = Math.min(tradedUpper, tickRange.upper);

  const { absBaseDelta, absQuoteDelta } = getDeltasFromLiquidity(
    liquidity,
    tradedLower,
    tradedUpper,
  );

  return {
    baseDelta: isVT ? absBaseDelta : -absBaseDelta,
    quoteDelta: isVT ? -absQuoteDelta : absQuoteDelta,
  };
};
