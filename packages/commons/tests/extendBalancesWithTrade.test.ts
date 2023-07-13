import { SECONDS_IN_YEAR } from '../src/constants';
import { extendBalancesWithTrade } from '../src/vamm-maths/trades/extendBalancesWithTrade';

const PRECISION = 6;

// Tests
describe('Position net balances', () => {
  const trade1 = {
    tradeTimestamp: 0,
    maturityTimestamp: SECONDS_IN_YEAR,
    baseDelta: 100,
    quoteDelta: -660,
    tradeLiquidityIndex: 1.1,
    existingPosition: null,
  };

  it('one trade', async () => {
    // Trade 1. Base = 100, LiquidityIndex = 1.1, FixedRate = 5% (at T=0)

    const netBalances = extendBalancesWithTrade({
      ...trade1,
      existingPosition: null,
    });

    expect(netBalances.base).toBeCloseTo(100, PRECISION);
    expect(netBalances.timeDependentQuote).toBeCloseTo(-5.5, PRECISION);
    expect(netBalances.freeQuote).toBeCloseTo(-110, PRECISION);
    expect(netBalances.lockedFixedRate).toBeCloseTo(0.05, PRECISION);

    // Moment of query: Q=3/4 where Li = 1.75
    const cashflow =
      netBalances.base * 1.75 +
      (netBalances.timeDependentQuote * 3) / 4 +
      netBalances.freeQuote;

    expect(cashflow).toBeCloseTo(60.875, PRECISION);
  });

  it('extending exposure', async () => {
    // Trade 1. Base = 100, LiquidityIndex = 1.1, FixedRate = 0.05 (at T=0)
    // Trade 2. Base = 80, LiquidityIndex = 1.5, FixedRate = 0.1 (at T=1/2)

    const trade2 = {
      tradeTimestamp: SECONDS_IN_YEAR / 2,
      maturityTimestamp: SECONDS_IN_YEAR,
      baseDelta: 80,
      quoteDelta: -720,
      tradeLiquidityIndex: 1.5,
    };

    const netBalances = extendBalancesWithTrade({
      ...trade2,
      existingPosition: extendBalancesWithTrade({
        ...trade1,
        existingPosition: null,
      }),
    });

    expect(netBalances.base).toBeCloseTo(180, PRECISION);
    expect(netBalances.timeDependentQuote).toBeCloseTo(-17.5, PRECISION);
    expect(netBalances.freeQuote).toBeCloseTo(-224, PRECISION);
    expect(netBalances.lockedFixedRate).toBeCloseTo(
      0.0760869565217391,
      PRECISION,
    );

    // Moment of query: Q=3/4 where Li = 1.75
    const cashflow =
      netBalances.base * 1.75 +
      (netBalances.timeDependentQuote * 3) / 4 +
      netBalances.freeQuote;

    expect(cashflow).toBeCloseTo(77.875, PRECISION);
  });

  it('lowering exposure', async () => {
    // Trade 1. Base = 100, LiquidityIndex = 1.1, FixedRate = 0.05 (at T=0)
    // Trade 2. Base = -80, LiquidityIndex = 1.5, FixedRate = 0.1 (at T=1/2)

    const trade2 = {
      tradeTimestamp: SECONDS_IN_YEAR / 2,
      maturityTimestamp: SECONDS_IN_YEAR,
      baseDelta: -80,
      quoteDelta: 720,
      tradeLiquidityIndex: 1.5,
    };

    const netBalances = extendBalancesWithTrade({
      ...trade2,
      existingPosition: extendBalancesWithTrade({
        ...trade1,
        existingPosition: null,
      }),
    });

    expect(netBalances.base).toBeCloseTo(20, PRECISION);
    expect(netBalances.timeDependentQuote).toBeCloseTo(-1.1, PRECISION);
    expect(netBalances.freeQuote).toBeCloseTo(11.6, PRECISION);
    expect(netBalances.lockedFixedRate).toBeCloseTo(0.05, PRECISION);

    // Moment of query: Q=3/4 where Li = 1.75
    const cashflow =
      netBalances.base * 1.75 +
      (netBalances.timeDependentQuote * 3) / 4 +
      netBalances.freeQuote;

    expect(cashflow).toBeCloseTo(45.775, PRECISION);
  });

  it('going in the other direction', async () => {
    // Trade 1. Base = 100, LiquidityIndex = 1.1, FixedRate = 0.05 (at T=0)
    // Trade 2. Base = -160, LiquidityIndex = 1.5, FixedRate = 0.1 (at T=1/2)

    const trade2 = {
      tradeTimestamp: SECONDS_IN_YEAR / 2,
      maturityTimestamp: SECONDS_IN_YEAR,
      baseDelta: -160,
      quoteDelta: 1440,
      tradeLiquidityIndex: 1.5,
    };

    const netBalances = extendBalancesWithTrade({
      ...trade2,
      existingPosition: extendBalancesWithTrade({
        ...trade1,
        existingPosition: null,
      }),
    });

    expect(netBalances.base).toBeCloseTo(-60, PRECISION);
    expect(netBalances.timeDependentQuote).toBeCloseTo(9, PRECISION);
    expect(netBalances.freeQuote).toBeCloseTo(127.5, PRECISION);
    expect(netBalances.lockedFixedRate).toBeCloseTo(0.1, PRECISION);

    // Moment of query: Q=3/4 where Li = 1.75
    const cashflow =
      netBalances.base * 1.75 +
      (netBalances.timeDependentQuote * 3) / 4 +
      netBalances.freeQuote;

    expect(cashflow).toBeCloseTo(29.25, PRECISION);
  });
});
