import { SECONDS_IN_YEAR, computeRealizedPnL } from '../../src';

describe('Realized PnL calculation', () => {
  it('VT, PnL > 0', async () => {
    const pnl = computeRealizedPnL({
      base: 100,
      timeDependentQuote: -5.5,
      freeQuote: -107.25,
      queryTimestamp: SECONDS_IN_YEAR,
      liquidityIndexAtQuery: 1.21,
    });

    expect(pnl).toBe(8.25);
  });

  it('VT, PnL < 0', async () => {
    const pnl = computeRealizedPnL({
      base: 100,
      timeDependentQuote: -33,
      freeQuote: -93.5,
      queryTimestamp: SECONDS_IN_YEAR,
      liquidityIndexAtQuery: 1.21,
    });

    expect(pnl).toBe(-5.5);
  });

  it('FT, PnL < 0', async () => {
    const pnl = computeRealizedPnL({
      base: -100,
      timeDependentQuote: 5.5,
      freeQuote: 107.25,
      queryTimestamp: SECONDS_IN_YEAR,
      liquidityIndexAtQuery: 1.21,
    });

    expect(pnl).toBe(-8.25);
  });

  it('FT, PnL > 0', async () => {
    const pnl = computeRealizedPnL({
      base: -100,
      timeDependentQuote: 33,
      freeQuote: 93.5,
      queryTimestamp: SECONDS_IN_YEAR,
      liquidityIndexAtQuery: 1.21,
    });

    expect(pnl).toBe(5.5);
  });
});
