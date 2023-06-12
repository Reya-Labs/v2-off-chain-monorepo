import { ethers, BigNumber } from 'ethers';
import { SwapPeripheryParams } from '../types/actionArgTypes';
import { getReadableErrorMessage } from '../../common/errors/errorHandling';

export const estimateSwapGasUnits = async (
  peripheryContract: ethers.Contract,
  swapPeripheryParams: SwapPeripheryParams,
  swapPeripheryTempOverrides: { value?: BigNumber; gasLimit?: BigNumber },
): Promise<BigNumber> => {
  const estimatedGas: BigNumber = await peripheryContract.estimateGas
    .swap(
      swapPeripheryParams.marginEngineAddress,
      swapPeripheryParams.isFT,
      swapPeripheryParams.notional,
      swapPeripheryParams.sqrtPriceLimitX96,
      swapPeripheryParams.tickLower,
      swapPeripheryParams.tickUpper,
      swapPeripheryParams.marginDelta,
      swapPeripheryTempOverrides,
    )
    .catch((error) => {
      const errorMessage = getReadableErrorMessage(error);
      throw new Error(errorMessage);
    });

  return estimatedGas;
};
