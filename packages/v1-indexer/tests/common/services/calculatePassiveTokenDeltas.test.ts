import { calculatePassiveTokenDeltas } from '../../../src/common/services/calculatePassiveTokenDeltas';

describe('get locked in profit', () => {
  const tests: [[number, number, number, number, number], [number, number]][] =
    [
      [
        [1000, 0, 1200, 300, 900],
        [30.9132, -29.113],
      ], // full in range, VT
      [
        [1000, 0, 1200, 900, 300],
        [-30.9132, 29.113],
      ], // full in range, FT

      [
        [1000, 0, 1200, -300, 900],
        [46.0255, -44.0003],
      ], // overlaps in left, VT
      [
        [1000, 0, 1200, 900, -300],
        [-46.0255, 44.0003],
      ], // overlaps in left, FT

      [
        [1000, 0, 1200, 300, 1500],
        [46.721, -43.3453],
      ], // overlaps in right, VT
      [
        [1000, 0, 1200, 1500, 300],
        [-46.721, 43.3453],
      ], // overlaps in right, FT

      [
        [1000, 0, 1200, -1200, -600],
        [0, 0],
      ], // out of range in left, VT
      [
        [1000, 0, 1200, -600, -1200],
        [0, 0],
      ], // out of range in left, FT

      [
        [1000, 0, 1200, 1800, 2400],
        [0, 0],
      ], // out of range in right, VT
      [
        [1000, 0, 1200, 2400, 1800],
        [0, 0],
      ], // out of range in right, FT

      [
        [1000, 0, 1200, -1200, 2400],
        [61.8333, -58.2326],
      ], // tick crosses full range, VT
      [
        [1000, 0, 1200, 2400, -1200],
        [-61.8333, 58.2326],
      ], // tick crosses full range, FT

      [
        [1000, 0, 1200, 0, 0],
        [0, 0],
      ], // unchanged tick
    ];

  tests.forEach(([input, expectedOutput]) => {
    it('calculate passive token delta', () => {
      const { variableTokenDelta, fixedTokenDeltaUnbalanced } =
        calculatePassiveTokenDeltas(...input);

      expect(variableTokenDelta).toBeCloseTo(expectedOutput[0]);
      expect(fixedTokenDeltaUnbalanced).toBeCloseTo(expectedOutput[1]);
    });
  });
});
