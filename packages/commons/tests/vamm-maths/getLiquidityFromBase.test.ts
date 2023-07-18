import { getLiquidityFromBase } from '../../src';

const PRECISION = 6;

describe('Base to liquidity conversion', () => {
  it('base > 0 (1)', async () => {
    const liquidity = getLiquidityFromBase(100, 0, 6960);

    expect(liquidity).toBeCloseTo(240.26470876592083, PRECISION);
  });

  it('base > 0 (2)', async () => {
    const liquidity = getLiquidityFromBase(100, -6960, 6960);

    expect(liquidity).toBeCloseTo(140.82594040203088, PRECISION);
  });

  it('base < 0 (1)', async () => {
    const liquidity = getLiquidityFromBase(-100, 0, 6960);

    expect(liquidity).toBeCloseTo(-240.26470876592083, PRECISION);
  });

  it('base < 0 (2)', async () => {
    const liquidity = getLiquidityFromBase(-100, -6960, 6960);

    expect(liquidity).toBeCloseTo(-140.82594040203088, PRECISION);
  });

  it('base = 0', async () => {
    const liquidity = getLiquidityFromBase(0, 0, 6960);

    expect(liquidity).toBeCloseTo(0, PRECISION);
  });

  it('Equal ticks', async () => {
    expect(() => getLiquidityFromBase(100, 6960, 6960)).toThrowError();
  });

  it('Unordered ticks', async () => {
    expect(() => getLiquidityFromBase(100, 6960, -6960)).toThrowError();
  });
});
