import { BigNumberish, utils } from 'ethers';

export const descale = (valueToDescale: BigNumberish, desclaingFactor: number): number => {
  return Number(utils.formatUnits(valueToDescale, desclaingFactor));
};