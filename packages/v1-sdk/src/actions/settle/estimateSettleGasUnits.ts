import { ethers, BigNumber } from 'ethers';
import { SettlePeripheryParams } from '../types/actionArgTypes';

export const estimateSettleGasUnits = async (
  peripheryContract: ethers.Contract,
  settlePeripheryParams: SettlePeripheryParams
): Promise<BigNumber> => {
  const estimatedGas: BigNumber = await peripheryContract.estimateGas
    .settlePositionAndWithdrawMargin(
      settlePeripheryParams.marginEngineAddress,
      settlePeripheryParams.positionOwnerAddress,
      settlePeripheryParams.tickLower,
      settlePeripheryParams.tickUpper
    )
    .catch((error) => {
      console.error(error);
      throw new Error(
        'Error estimating settle position and withdraw margin gas units',
      );
    });

  return estimatedGas;
};
