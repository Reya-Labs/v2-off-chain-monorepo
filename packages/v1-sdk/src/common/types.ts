import JSBI from 'jsbi';
import { BigNumberish } from 'ethers';

export type BigIntish = JSBI | string | number;
export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP,
}