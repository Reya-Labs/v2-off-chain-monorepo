import { getDeltasFromLiquidity } from '../../src';

const PRECISION = 6;

describe('Liquidity to vamm trackers conversion', () => {
  it('base > 0', async () => {
    const { x, y } = getDeltasFromLiquidity(240.26470876592083, 0, 6960);

    expect(x).toBeCloseTo(100, PRECISION);
    expect(y).toBeCloseTo(70.611116162272, PRECISION);
  });

  it('base < 0', async () => {
    const { x, y } = getDeltasFromLiquidity(-240.26470876592083, 0, 6960);

    expect(x).toBeCloseTo(-100, PRECISION);
    expect(y).toBeCloseTo(-70.611116162272, PRECISION);
  });

  it('base = 0', async () => {
    const { x, y } = getDeltasFromLiquidity(0, 0, 6960);

    expect(x).toBeCloseTo(0, PRECISION);
    expect(y).toBeCloseTo(0, PRECISION);
  });

  it('Equal ticks', async () => {
    expect(() => getDeltasFromLiquidity(0, 6960, 6960)).toThrowError();
  });

  it('Unordered ticks', async () => {
    expect(() => getDeltasFromLiquidity(0, 6960, -6960)).toThrowError();
  });
});
