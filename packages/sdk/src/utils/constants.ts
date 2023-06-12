import { BigNumber } from 'ethers';

export const ZERO_BN = BigNumber.from(0);
export const MINUS_ONE_BN = BigNumber.from(-1);
export const ONE_BN = BigNumber.from(1);
export const WAD = BigNumber.from(10).pow(18);
export const RAY = BigNumber.from(10).pow(27);

export const VERY_BIG_NUMBER = WAD.mul(WAD);
