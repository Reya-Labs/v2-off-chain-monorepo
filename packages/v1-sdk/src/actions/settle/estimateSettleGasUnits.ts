import { ethers, BigNumber } from 'ethers';
import { SettlePeripheryParams } from '../types/actionArgTypes';

export const estimateSettleGasUnits = async (
  peripheryContract: ethers.Contract,
  settlePeripheryParams: SettlePeripheryParams,
  settlePeripheryTempOverrides: { value?: BigNumber; gasLimit?: BigNumber },
): Promise<BigNumber> => {
  const estimatedGas: BigNumber = await peripheryContract.estimateGas
    .settlePositionAndWithdrawMargin(
      settlePeripheryParams,
      settlePeripheryTempOverrides,
    )
    .catch((error) => {
      throw new Error(
        'Error estimating settle position and withdraw margin gas units',
      );
    });

  return estimatedGas;
};
