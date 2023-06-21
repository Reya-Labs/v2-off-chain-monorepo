import { assert } from './assert';
import { computeRealizedPnL } from './computeRealizedPnL';
import { SECONDS_IN_YEAR } from './constants';
import { getPositionNetBalances } from './extendBalancesWithTrade';
import { getTimestampInSeconds } from './getTimestampInSeconds';

export const computeUnrealizedPnL = ({
  base,
  timeDependentQuote,
  freeQuote,
  currentLiquidityIndex,
  currentFixedRate,
  maturityTimestamp,
}: {
  base: number;
  timeDependentQuote: number;
  freeQuote: number;
  currentLiquidityIndex: number;
  currentFixedRate: number;
  maturityTimestamp: number;
}) => {
  const now = getTimestampInSeconds();

  const unwindBase = -base;
  const unwindQuoteDelta =
    -unwindBase *
    currentLiquidityIndex *
    (1 + (currentFixedRate * (maturityTimestamp - now)) / SECONDS_IN_YEAR);

  const unwindBalances = getPositionNetBalances({
    tradeLiquidityIndex: currentLiquidityIndex,
    maturityTimestamp,
    baseDelta: unwindBase,
    quoteDelta: unwindQuoteDelta,
    tradeTimestamp: now,
    existingPosition: {
      base,
      timeDependentQuote,
      freeQuote,
      notional: 0, // not interested in this
      lockedFixedRate: 0, // not interested in this
    },
  });

  assert(unwindBalances.base === 0, 'Base should be 0 after unwind');

  return computeRealizedPnL({
    ...unwindBalances,
    queryTimestamp: maturityTimestamp,
    liquidityIndexAtQuery: 1, // base is 0, liquidity index does not matter
  });
};
