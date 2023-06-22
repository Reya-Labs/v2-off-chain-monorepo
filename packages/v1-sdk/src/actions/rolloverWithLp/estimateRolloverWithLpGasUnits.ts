import { BigNumber, ethers } from 'ethers';
import { RolloverWithLpPeripheryParams } from '../types/actionArgTypes';
import { getReadableErrorMessage } from '../../common/errors/errorHandling';

export const estimateRolloverWithLpGasUnits = async (
  peripheryContract: ethers.Contract,
  rolloverAndLpPeripheryParams: RolloverWithLpPeripheryParams,
  rolloverAndLpPeripheryTempOverrides: {
    value?: BigNumber;
    gasLimit?: BigNumber;
  },
): Promise<BigNumber> => {
  const estimatedGas: BigNumber = await peripheryContract.estimateGas
    .rolloverWithMint(
      rolloverAndLpPeripheryParams.maturedMarginEngineAddress,
      rolloverAndLpPeripheryParams.maturedPositionOwnerAddress,
      rolloverAndLpPeripheryParams.maturedPositionTickLower,
      rolloverAndLpPeripheryParams.maturedPositionTickUpper,
      rolloverAndLpPeripheryParams.newLpPeripheryParams.marginEngineAddress,
      rolloverAndLpPeripheryParams.newLpPeripheryParams.tickLower,
      rolloverAndLpPeripheryParams.newLpPeripheryParams.tickUpper,
      rolloverAndLpPeripheryParams.newLpPeripheryParams.notional,
      rolloverAndLpPeripheryParams.newLpPeripheryParams.isMint,
      rolloverAndLpPeripheryParams.newLpPeripheryParams.marginDelta,
      rolloverAndLpPeripheryTempOverrides,
    )
    .catch((error: any) => {
      const errorMessage = getReadableErrorMessage(error);
      throw new Error(errorMessage);
    });

  return estimatedGas;
};
