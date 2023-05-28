import { BigNumber } from 'ethers';

export function getGasBuffer(value: BigNumber): BigNumber {
  return value.mul(120).div(100);
}
