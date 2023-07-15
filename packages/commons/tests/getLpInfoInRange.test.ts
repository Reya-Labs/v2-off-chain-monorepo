import { getLpInfoInRange } from '../src/vamm-maths';

const PRECISION = 6;

describe('LP information in range', () => {
  const lp1 = {
    liquidity: 240.26470876592083,
    tickLower: 0,
    tickUpper: 6960,
  };

  const lp2 = {
    liquidity: 100,
    tickLower: 3480,
    tickUpper: 10440,
  };

  it('no LPs', async () => {
    const { base, avgFix } = getLpInfoInRange([], 0, 6960);

    expect(base).toBeCloseTo(0, PRECISION);
    expect(avgFix).toBeCloseTo(0, PRECISION);
  });

  it('no overlapping LPs', async () => {
    const { base, avgFix } = getLpInfoInRange([lp1], 13920, 20880);

    expect(base).toBeCloseTo(0, PRECISION);
    expect(avgFix).toBeCloseTo(0, PRECISION);
  });

  it('1 LP, fully traded by FT', async () => {
    const { base, avgFix } = getLpInfoInRange([lp1], 0, 6960);

    expect(base).toBeCloseTo(-100, PRECISION);
    expect(avgFix).toBeCloseTo(0.0070611116162272, PRECISION);
  });

  it('1 LP, fully traded by VT', async () => {
    const { base, avgFix } = getLpInfoInRange([lp1], 6960, 0);

    expect(base).toBeCloseTo(100, PRECISION);
    expect(avgFix).toBeCloseTo(0.0070611116162272, PRECISION);
  });

  it('1 LP, partially traded by FT', async () => {
    const { base, avgFix } = getLpInfoInRange([lp1], 0, 3480);

    expect(base).toBeCloseTo(-45.6611577711, PRECISION);
    expect(avgFix).toBeCloseTo(0.008403042077859184, PRECISION);
  });

  it('2 LPs, traded by FT', async () => {
    const { base, avgFix } = getLpInfoInRange([lp1, lp2], 0, 6960);

    expect(base).toBeCloseTo(-122.61623960837593, PRECISION);
    expect(avgFix).toBeCloseTo(0.006853123293209496, PRECISION);
  });
});
