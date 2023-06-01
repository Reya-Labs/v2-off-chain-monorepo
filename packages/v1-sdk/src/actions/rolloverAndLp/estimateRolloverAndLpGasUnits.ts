import { BigNumber, ethers } from 'ethers';
import { RolloverAndLpPeripheryParams } from '../types/actionArgTypes';

export const estimateRolloverAndLpGasUnits = async (
  peripheryContract: ethers.Contract,
  rolloverAndLpPeripheryParams: RolloverAndLpPeripheryParams,
  rolloverAndLpPeripheryTempOverrides: {
    value?: BigNumber;
    gasLimit?: BigNumber;
  },
): Promise<BigNumber> => {
  const estimatedGas: BigNumber = await peripheryContract.estimateGas
    .rolloverWithLp(
      rolloverAndLpPeripheryParams,
      rolloverAndLpPeripheryTempOverrides,
    )
    .catch((error) => {
      throw new Error('Error estimating rollover and lp gas units');
    });

  return estimatedGas;
};
