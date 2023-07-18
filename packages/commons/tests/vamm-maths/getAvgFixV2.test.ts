import { SECONDS_IN_YEAR, getAvgFixV2 } from '../../src';

const PRECISION = 6;

describe('Average fixed rate of trade v2', () => {
  it('one-year trade (VT)', async () => {
    const trade = {
      base: 100,
      quote: -115.5,
      liquidityIndex: 1.1,
      entryTimestamp: 0,
      maturityTimestamp: SECONDS_IN_YEAR,
    };

    const avgFix = getAvgFixV2(trade);

    expect(avgFix).toBeCloseTo(0.05, PRECISION);
  });

  it('half-year trade (FT)', async () => {
    const trade = {
      base: -100,
      quote: 112.75,
      liquidityIndex: 1.1,
      entryTimestamp: SECONDS_IN_YEAR / 2,
      maturityTimestamp: SECONDS_IN_YEAR,
    };

    const avgFix = getAvgFixV2(trade);

    expect(avgFix).toBeCloseTo(0.05, PRECISION);
  });

  it('matured trade', async () => {
    const trade = {
      base: -100,
      quote: 112.75,
      liquidityIndex: 1.1,
      entryTimestamp: SECONDS_IN_YEAR + 1,
      maturityTimestamp: SECONDS_IN_YEAR,
    };

    const avgFix = getAvgFixV2(trade);

    expect(avgFix).toBeCloseTo(0);
  });
});
