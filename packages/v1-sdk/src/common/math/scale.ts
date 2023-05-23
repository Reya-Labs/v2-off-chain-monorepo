import { BigNumberish, utils } from "ethers";
export const scale = (valueToScale: number, scalingMultiplier: number): BigNumberish => {
  return utils
    .parseUnits(valueToScale.toFixed(scalingMultiplier), scalingMultiplier)
    .toString();
}