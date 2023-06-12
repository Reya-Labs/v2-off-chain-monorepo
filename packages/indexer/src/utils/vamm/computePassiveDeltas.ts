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
  console.log('args:', liquidity, tickMove, tickRange);

  if (tickMove.from > tickMove.to) {
    const result = computePassiveDeltas({
      liquidity,
      tickMove: {
        from: tickMove.to,
        to: tickMove.from,
      },
      tickRange,
    });

    return {
      baseDelta: -result.baseDelta,
      quoteDelta: -result.quoteDelta,
    };
  }

  // no overlap, LP is not affected by this trade
  if (tickMove.from >= tickRange.upper || tickMove.to <= tickRange.lower) {
    return {
      baseDelta: 0,
      quoteDelta: 0,
    };
  }

  const { absBaseDelta, absQuoteDelta } = getDeltasFromLiquidity(
    liquidity,
    Math.max(tickMove.from, tickRange.lower),
    Math.min(tickMove.to, tickRange.upper),
  );

  return {
    baseDelta: -absBaseDelta,
    quoteDelta: absQuoteDelta,
  };
};
