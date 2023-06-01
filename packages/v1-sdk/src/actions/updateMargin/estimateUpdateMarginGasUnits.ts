import { ethers, BigNumber } from 'ethers';
import { UpdateMarginPeripheryParams } from '../types/actionArgTypes';

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
      updateMarginPeripheryParams,
      updateMarginPeripheryTempOverrides,
    )
    .catch((error) => {
      throw new Error('Error estimating update margi gas units');
    });

  return estimatedGas;
};
