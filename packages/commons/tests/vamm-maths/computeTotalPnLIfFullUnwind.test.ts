import { SECONDS_IN_YEAR, computeTotalPnLIfFullUnwind } from '../../src';

const PRECISION = 6;

describe('PnL in case of full unwind calculation', () => {
  it('VT, PnL > 0, maturity = 1', async () => {
    const uPnL = computeTotalPnLIfFullUnwind({
      base: 100,
      timeDependentQuote: -5.5,
      freeQuote: -107.25,
      queryTimestamp: (SECONDS_IN_YEAR * 3) / 4,
      queryLiquidityIndex: 1.21,
      queryFixedRate: 0.1,
      maturityTimestamp: SECONDS_IN_YEAR,
    });

    expect(uPnL).toBeCloseTo(11.275, PRECISION);
  });

  it('VT, PnL > 0, maturity = 0.5', async () => {
    const uPnL = computeTotalPnLIfFullUnwind({
      base: 100,
      timeDependentQuote: -5.5,
      freeQuote: -110,
      queryTimestamp: SECONDS_IN_YEAR / 4,
      queryLiquidityIndex: 1.21,
      queryFixedRate: 0.1,
      maturityTimestamp: SECONDS_IN_YEAR / 2,
    });

    expect(uPnL).toBeCloseTo(11.275, PRECISION);
  });
});
