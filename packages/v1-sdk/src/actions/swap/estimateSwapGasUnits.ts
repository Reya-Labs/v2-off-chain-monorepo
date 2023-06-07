import { ethers, BigNumber } from 'ethers';
import { SwapPeripheryParams } from '../types/actionArgTypes';

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
      swapPeripheryTempOverrides
    )
    .catch((error) => {
      throw new Error('Failed to estimate gas for swap transaction');
    });

  return estimatedGas;
};
