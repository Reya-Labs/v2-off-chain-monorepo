import { BigNumber, ethers } from "ethers";
import { RolloverAndSwapPeripheryParams } from "../types/actionArgTypes";


export const estimateRolloverAndLpGasUnits = async (
  peripheryContract: ethers.Contract,
  rolloverAndLpPeripheryParams: RolloverAndSwapPeripheryParams,
  rolloverAndLpPeripheryTempOverrides: { value?: BigNumber; gasLimit?: BigNumber },
): Promise<BigNumber> => {
  const estimatedGas: BigNumber = await peripheryContract.estimateGas
    .rolloverWithLp(
      rolloverAndLpPeripheryParams,
      rolloverAndLpPeripheryTempOverrides,
    )
    .catch((error) => {
      throw new Error(
        'Error estimating rollover and lp gas units',
      );
    });

  return estimatedGas;
}