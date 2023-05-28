import JSBI from 'jsbi';
/**
 * The minimum fixed rate that can be used on any pool.
 */
export const MIN_FIXED_RATE = 0.001;
/**
 * The maximum fixed rate that can be used on any pool.
 */
export const MAX_FIXED_RATE = 1001;

export const MaxUint256 = JSBI.BigInt(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
);

export const NEGATIVE_ONE = JSBI.BigInt(-1);
export const ZERO = JSBI.BigInt(0);
export const ONE = JSBI.BigInt(1);

// used in liquidity amount math
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

export const WETH9 = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
