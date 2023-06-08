import { ethers, BigNumber, BigNumberish } from 'ethers';
import { RolloverAndSwapPeripheryParams } from '../types/actionArgTypes';
import { getReadableErrorMessage } from '../../common/errors/errorHandling';

export const estimateRolloverAndSwapGasUnits = async (
  peripheryContract: ethers.Contract,
  rolloverAndSwapPeripheryParams: RolloverAndSwapPeripheryParams,
  rolloverAndSwapPeripheryTempOverrides: {
    value?: BigNumber;
    gasLimit?: BigNumber;
  },
): Promise<BigNumber> => {
  // todo: need typings for contracts to not have to unwrap rolloverAndSwapPeripheryParams

  const estimatedGas: BigNumber = await peripheryContract.estimateGas
    .rolloverWithSwap(
      rolloverAndSwapPeripheryParams.maturedMarginEngineAddress,
      rolloverAndSwapPeripheryParams.maturedPositionOwnerAddress,
      rolloverAndSwapPeripheryParams.maturedPositionTickLower,
      rolloverAndSwapPeripheryParams.maturedPositionTickUpper,
      rolloverAndSwapPeripheryParams.newSwapPeripheryParams.marginEngineAddress,
      rolloverAndSwapPeripheryParams.newSwapPeripheryParams.isFT,
      rolloverAndSwapPeripheryParams.newSwapPeripheryParams.notional,
      rolloverAndSwapPeripheryParams.newSwapPeripheryParams.sqrtPriceLimitX96,
      rolloverAndSwapPeripheryParams.newSwapPeripheryParams.tickLower,
      rolloverAndSwapPeripheryParams.newSwapPeripheryParams.tickUpper,
      rolloverAndSwapPeripheryParams.newSwapPeripheryParams.marginDelta,
      rolloverAndSwapPeripheryTempOverrides,
    )
    .catch(error => {
      const errorMessage = getReadableErrorMessage(error);
      throw new Error(errorMessage);
    });

  return estimatedGas;
};
