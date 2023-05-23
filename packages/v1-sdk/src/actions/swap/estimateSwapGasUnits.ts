import { ethers, BigNumber } from "ethers";
import { SwapPeripheryParams } from "../types/actionArgTypes";


export const estimateSwapGasUnits = async (
  peripheryContract: ethers.Contract,
  swapPeripheryParams: SwapPeripheryParams,
  swapPeripheryTempOverrides: { value?: BigNumber; gasLimit?: BigNumber }
): Promise<BigNumber> => {

  const estimatedGas: BigNumber = await peripheryContract.estimateGas
    .swap(
      swapPeripheryParams, swapPeripheryTempOverrides
    )
    .catch(
      (error) => {
        throw new Error("TODO: implement");
        // todo: implement
        // const errorMessage = getReadableErrorMessage(error);
        // throw new Error(errorMessage);
      }
    );

  return estimatedGas;
}