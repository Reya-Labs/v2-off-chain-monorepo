import { BigNumberish, utils } from 'ethers';
export const scale = (
  valueToScale: number,
  scalingMultiplier: number,
): BigNumberish => {
  console.log(utils);

  const scaledValue = utils
    .parseUnits(valueToScale.toFixed(scalingMultiplier), scalingMultiplier)
    .toString();

  return scaledValue;
};
