import { ethers, BigNumber } from 'ethers';
import { RolloverAndSwapPeripheryParams } from '../types/actionArgTypes';

export const estimateRolloverAndSwapGasUnits = async (
  peripheryContract: ethers.Contract,
  rolloverAndSwapPeripheryParams: RolloverAndSwapPeripheryParams,
  rolloverAndSwapPeripheryTempOverrides: {
    value?: BigNumber;
    gasLimit?: BigNumber;
  },
): Promise<BigNumber> => {
  const estimatedGas: BigNumber = await peripheryContract.estimateGas
    .rolloverWithSwap(
      rolloverAndSwapPeripheryParams,
      rolloverAndSwapPeripheryTempOverrides,
    )
    .catch((error) => {
      throw new Error('Error estimating rollover and swap gas units');
    });

  return estimatedGas;
};
