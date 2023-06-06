import JSBI from 'jsbi';

export type BigIntish = JSBI | string | number;
export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP,
}

export enum SupportedChainId {
  mainnet = 1,
  goerli = 5,
  arbitrum = 42161,
  arbitrumGoerli = 421613,
  avalanche = 43114,
  avalancheFuji = 43113,
}