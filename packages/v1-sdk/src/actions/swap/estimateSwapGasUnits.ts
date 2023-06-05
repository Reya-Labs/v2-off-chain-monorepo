import { ethers, BigNumber } from 'ethers';
import { SwapPeripheryParams } from '../types/actionArgTypes';

export const estimateSwapGasUnits = async (
  peripheryContract: ethers.Contract,
  swapPeripheryParams: SwapPeripheryParams,
  swapPeripheryTempOverrides: { value?: BigNumber; gasLimit?: BigNumber },
): Promise<BigNumber> => {
  const estimatedGas: BigNumber = await peripheryContract.estimateGas
    .swap(swapPeripheryParams, swapPeripheryTempOverrides)
    .catch((error) => {
      throw new Error('Failed to estimate gas for swap transaction');
    });

  return estimatedGas;
};
