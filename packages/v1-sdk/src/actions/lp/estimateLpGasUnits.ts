import { ethers, BigNumber } from "ethers";
import { LpPeripheryParams } from "../types/actionArgTypes";


export const estimateLpGasUnits = async (
  peripheryContract: ethers.Contract,
  lpPeripheryParams: LpPeripheryParams,
  lpPeripheryTempOverrides: { value?: BigNumber; gasLimit?: BigNumber }
): Promise<BigNumber> => {

  const estimatedGas: BigNumber = await peripheryContract.estimateGas
    .mintOrBurn(
      lpPeripheryParams, lpPeripheryTempOverrides
    )
    .catch(
      (error) => {
        throw new Error("Error estimating gas cost to execute LP action.");
      }
    );

  return estimatedGas;
}