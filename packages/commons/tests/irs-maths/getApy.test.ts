import { SECONDS_IN_YEAR, getApy } from '../../src';

const PRECISION = 6;

describe('APY calculation', () => {
  it('Compounding APY', () => {
    const apy = getApy(
      {
        index: 1,
        timestamp: 0,
      },
      {
        index: 1.05,
        timestamp: SECONDS_IN_YEAR / 2,
      },
      'compounding',
    );

    expect(apy).toBeCloseTo(0.1025, PRECISION);
  });

  it('Compounding APY - zero case', () => {
    const apy = getApy(
      {
        index: 1.05,
        timestamp: 0,
      },
      {
        index: 1.05,
        timestamp: SECONDS_IN_YEAR / 2,
      },
      'compounding',
    );

    expect(apy).toBeCloseTo(0, PRECISION);
  });

  it('Linear APY - zero case', () => {
    const apy = getApy(
      {
        index: 1.05,
        timestamp: 0,
      },
      {
        index: 1.05,
        timestamp: SECONDS_IN_YEAR / 2,
      },
      'linear',
    );

    expect(apy).toBeCloseTo(0, PRECISION);
  });

  it('Invalid APY - equal timestamps', () => {
    expect(() =>
      getApy(
        {
          index: 1,
          timestamp: SECONDS_IN_YEAR,
        },
        {
          index: 1.05,
          timestamp: SECONDS_IN_YEAR,
        },
        'linear',
      ),
    ).toThrowError();
  });

  it('Invalid APY - unoredered timestamps', () => {
    expect(() =>
      getApy(
        {
          index: 1,
          timestamp: SECONDS_IN_YEAR + 1,
        },
        {
          index: 1.05,
          timestamp: SECONDS_IN_YEAR,
        },
        'linear',
      ),
    ).toThrowError();
  });

  it('Invalid APY - unoredered indices', () => {
    expect(() =>
      getApy(
        {
          index: 1.05,
          timestamp: 0,
        },
        {
          index: 1,
          timestamp: SECONDS_IN_YEAR / 2,
        },
        'linear',
      ),
    ).toThrowError();
  });

  it('Invalid APY - index lower than 1', () => {
    expect(() =>
      getApy(
        {
          index: 0.99,
          timestamp: 0,
        },
        {
          index: 1.05,
          timestamp: SECONDS_IN_YEAR / 2,
        },
        'linear',
      ),
    ).toThrowError();
  });
});
