import { ethers, BigNumber } from 'ethers';
import { SettlePeripheryParams } from '../types/actionArgTypes';

export const estimateSettleGasUnits = async (
  peripheryContract: ethers.Contract,
  settlePeripheryParams: SettlePeripheryParams,
): Promise<BigNumber> => {
  const unsignedTx: ethers.PopulatedTransaction =
    await peripheryContract.populateTransaction.settlePositionAndWithdrawMargin(
      settlePeripheryParams.marginEngineAddress,
      settlePeripheryParams.positionOwnerAddress,
      settlePeripheryParams.tickLower,
      settlePeripheryParams.tickUpper,
    );

  const estimatedGas: BigNumber = await peripheryContract.estimateGas
    .settlePositionAndWithdrawMargin(
      settlePeripheryParams.marginEngineAddress,
      settlePeripheryParams.positionOwnerAddress,
      settlePeripheryParams.tickLower,
      settlePeripheryParams.tickUpper,
    )
    .catch((error) => {
      console.error(error);
      console.log(unsignedTx);
      throw new Error(
        'Error estimating settle position and withdraw margin gas units.',
      );
    });

  return estimatedGas;
};
