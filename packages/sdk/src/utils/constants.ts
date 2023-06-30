import { BigNumber } from 'ethers';

export const ZERO_BN = BigNumber.from(0);
export const MINUS_ONE_BN = BigNumber.from(-1);
export const ONE_BN = BigNumber.from(1);
export const WAD = BigNumber.from(10).pow(18);
export const RAY = BigNumber.from(10).pow(27);

export const MIN_TICK = -69100;
export const MAX_TICK = 69100;

export const MIN_FIXED_RATE = 0.001;
export const MAX_FIXED_RATE = 1001;
