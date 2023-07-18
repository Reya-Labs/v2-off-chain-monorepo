import { BigNumber } from 'ethers';
import { descale } from '../../src';

const PRECISION = 6;

const tests: [number, BigNumber, number][] = [
  [0, BigNumber.from('1'), 1],
  [6, BigNumber.from('1000000'), 1],
  [6, BigNumber.from('1111111'), 1.111111],
  [18, BigNumber.from('112312123120000'), 0.00011231212312],
];

describe('Token descaler', () => {
  tests.map(([tokenDecimals, value, expected], i) =>
    it(`Token descaler ${i}`, () => {
      const output = descale(tokenDecimals)(value);
      expect(output).toBeCloseTo(expected, PRECISION);
    }),
  );
});
