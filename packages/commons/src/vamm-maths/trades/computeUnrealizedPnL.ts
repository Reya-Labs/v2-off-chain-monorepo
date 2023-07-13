import { assert } from '../../assert';
import { computeRealizedPnL } from './computeRealizedPnL';
import { SECONDS_IN_YEAR } from '../../constants';
import { extendBalancesWithTrade } from './extendBalancesWithTrade';

// todo: change the implementation (incorrect)

export const computeUnrealizedPnL = ({
  base,
  timeDependentQuote,
  freeQuote,
  queryTimestamp,
  queryLiquidityIndex,
  queryFixedRate,
  maturityTimestamp,
}: {
  base: number;
  timeDependentQuote: number;
  freeQuote: number;
  queryTimestamp: number;
  queryLiquidityIndex: number;
  queryFixedRate: number;
  maturityTimestamp: number;
}) => {
  const unwindBase = -base;
  const unwindQuoteDelta =
    -unwindBase *
    queryLiquidityIndex *
    (1 +
      (queryFixedRate * (maturityTimestamp - queryTimestamp)) /
        SECONDS_IN_YEAR);

  const unwindBalances = extendBalancesWithTrade({
    tradeLiquidityIndex: queryLiquidityIndex,
    maturityTimestamp,
    baseDelta: unwindBase,
    quoteDelta: unwindQuoteDelta,
    tradeTimestamp: queryTimestamp,
    existingPosition: {
      base,
      timeDependentQuote,
      freeQuote,
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
