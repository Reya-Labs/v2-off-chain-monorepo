import { BigNumber } from 'ethers';
import { scale } from '../../src';

const tests: [number, number, BigNumber][] = [
  [0, 1, BigNumber.from('1')],
  [6, 1, BigNumber.from('1000000')],
  [6, 1.111111, BigNumber.from('1111111')],
  [6, 1.1111114456, BigNumber.from('1111111')],
  [6, 1.1111119456, BigNumber.from('1111112')],
  [18, 0.00011231212312, BigNumber.from('112312123120000')],
];

describe('Token scaler', () => {
  tests.map(([tokenDecimals, value, expected], i) =>
    it(`Token scaler ${i}`, () => {
      const output = scale(tokenDecimals)(value);
      expect(output.eq(expected)).toBe(true);
    }),
  );
});
