import { ethers, BigNumber } from 'ethers';
import { LpPeripheryParams } from '../types/actionArgTypes';
import { getReadableErrorMessage } from '../../common/errors/errorHandling';

export const estimateLpGasUnits = async (
  peripheryContract: ethers.Contract,
  lpPeripheryParams: LpPeripheryParams,
  lpPeripheryTempOverrides: { value?: BigNumber; gasLimit?: BigNumber },
): Promise<BigNumber> => {
  const estimatedGas: BigNumber = await peripheryContract.estimateGas
    .mintOrBurn(
      lpPeripheryParams.marginEngineAddress,
      lpPeripheryParams.tickLower,
      lpPeripheryParams.tickUpper,
      lpPeripheryParams.notional,
      lpPeripheryParams.isMint,
      lpPeripheryParams.marginDelta,
      lpPeripheryTempOverrides,
    )
    .catch(error => {
      const errorMessage = getReadableErrorMessage(error);
      throw new Error(errorMessage);
    });

  return estimatedGas;
};
