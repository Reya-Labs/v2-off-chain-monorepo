import { SECONDS_IN_YEAR } from './constants';

type Balances = {
  base: number;
  timeDependentQuote: number;
  freeQuote: number;
  notional: number;
  lockedFixedRate: number;
};

export const extendBalancesWithTrade = ({
  tradeTimestamp,
  maturityTimestamp,
  baseDelta,
  quoteDelta,
  tradeLiquidityIndex,
  existingPosition,
}: {
  tradeTimestamp: number;
  maturityTimestamp: number;
  baseDelta: number;
  quoteDelta: number;
  tradeLiquidityIndex: number;
  existingPosition: Balances | null;
}): Balances => {
  if (baseDelta === 0 || tradeLiquidityIndex === 0) {
    throw new Error(`Couldn't get net balances of empty trade`);
  }

  const timeDelta = (maturityTimestamp - tradeTimestamp) / SECONDS_IN_YEAR;

  const notionalDelta = baseDelta * tradeLiquidityIndex;
  const fixedRate = (-quoteDelta / notionalDelta - 1) / timeDelta / 100;

  const timeDependentQuoteDelta = -notionalDelta * fixedRate;
  const freeQuoteDelta =
    -notionalDelta +
    (notionalDelta * fixedRate * tradeTimestamp) / SECONDS_IN_YEAR;

  const netBalances = getNetBalances({
    currentPosition: {
      base: existingPosition?.base || 0,
      timeDependentQuote: existingPosition?.timeDependentQuote || 0,
      freeQuote: existingPosition?.freeQuote || 0,
      notional: existingPosition?.notional || 0,
      lockedFixedRate: existingPosition?.lockedFixedRate || 0,
    },
    incomingTrade: {
      base: baseDelta,
      timeDependentQuote: timeDependentQuoteDelta,
      freeQuote: freeQuoteDelta,
      notional: notionalDelta,
      lockedFixedRate: fixedRate,
    },
    maturityTimestamp,
  });

  return netBalances;
};

const getNetBalances = ({
  currentPosition,
  incomingTrade,
  maturityTimestamp,
}: {
  currentPosition: Balances;
  incomingTrade: Balances;
  maturityTimestamp: number;
}): Balances => {
  // Extending position
  if (
    (currentPosition.base >= 0 && incomingTrade.base >= 0) ||
    (currentPosition.base <= 0 && incomingTrade.base <= 0)
  ) {
    const lockedFixedRate =
      (currentPosition.notional * currentPosition.lockedFixedRate +
        incomingTrade.notional * incomingTrade.lockedFixedRate) /
      (currentPosition.notional + incomingTrade.notional);

    return {
      base: currentPosition.base + incomingTrade.base,
      timeDependentQuote:
        currentPosition.timeDependentQuote + incomingTrade.timeDependentQuote,
      freeQuote: currentPosition.freeQuote + incomingTrade.freeQuote,
      notional: currentPosition.notional + incomingTrade.notional,
      lockedFixedRate,
    };
  }

  // Lowering exposure
  if (
    (currentPosition.base >= 0 &&
      currentPosition.base + incomingTrade.base >= 0) ||
    (currentPosition.base <= 0 &&
      currentPosition.base + incomingTrade.base <= 0)
  ) {
    const projectedTimeDependentQuote =
      (-incomingTrade.base / currentPosition.base) *
      currentPosition.timeDependentQuote;

    const lockedCashflow =
      ((projectedTimeDependentQuote + incomingTrade.timeDependentQuote) *
        maturityTimestamp) /
      SECONDS_IN_YEAR;

    return {
      base: currentPosition.base + incomingTrade.base,
      timeDependentQuote:
        currentPosition.timeDependentQuote - projectedTimeDependentQuote,
      freeQuote:
        currentPosition.freeQuote + incomingTrade.freeQuote + lockedCashflow,
      notional: currentPosition.notional + incomingTrade.notional,
      lockedFixedRate: currentPosition.lockedFixedRate,
    };
  }

  return getNetBalances({
    currentPosition: incomingTrade,
    incomingTrade: currentPosition,
    maturityTimestamp,
  });
};