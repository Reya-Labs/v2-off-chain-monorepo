import JSBI from 'jsbi';

export const MaxUint256 = JSBI.BigInt(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
);
export const ZERO = JSBI.BigInt(0);
export const ONE = JSBI.BigInt(1);

export const TWO = JSBI.BigInt(2);
export const POWERS_OF_2 = [128, 64, 32, 16, 8, 4, 2, 1].map(
  (pow: number): [number, JSBI] => [
    pow,
    JSBI.exponentiate(TWO, JSBI.BigInt(pow)),
  ],
);

export const Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96));
export const Q192 = JSBI.exponentiate(Q96, JSBI.BigInt(2));

/**
 * The minimum tick that can be used on any pool.
 */
export const MIN_TICK = -69100;
/**
 * The maximum tick that can be used on any pool.
 */
export const MAX_TICK = 69100;

/**
 * The minimum tick that can be used on any pool.
 */
export const MIN_FIXED_RATE = 0.001;
/**
 * The maximum tick that can be used on any pool.
 */
export const MAX_FIXED_RATE = 1001;

export const TICK_SPACING = 60;
