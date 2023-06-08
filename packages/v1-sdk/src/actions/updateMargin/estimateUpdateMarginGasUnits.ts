import { ethers, BigNumber } from 'ethers';
import { UpdateMarginPeripheryParams } from '../types/actionArgTypes';
import { getReadableErrorMessage } from '../../common/errors/errorHandling';

export const estimateUpdateMarginGasUnits = async (
  peripheryContract: ethers.Contract,
  updateMarginPeripheryParams: UpdateMarginPeripheryParams,
  updateMarginPeripheryTempOverrides: {
    value?: BigNumber;
    gasLimit?: BigNumber;
  },
): Promise<BigNumber> => {
  const estimatedGas: BigNumber = await peripheryContract.estimateGas
    .updatePositionMargin(
      updateMarginPeripheryParams.marginEngineAddress,
      updateMarginPeripheryParams.tickLower,
      updateMarginPeripheryParams.tickUpper,
      updateMarginPeripheryParams.marginDelta,
      updateMarginPeripheryParams.fullyWithdraw,
      updateMarginPeripheryTempOverrides,
    )
    .catch((error: any) => {
      const errorMessage = getReadableErrorMessage(error);
      throw new Error(errorMessage);
    });

  return estimatedGas;
};
