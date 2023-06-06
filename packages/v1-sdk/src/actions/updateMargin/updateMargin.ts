import {
  SettlePeripheryParams,
  UpdateMarginArgs,
  UpdateMarginPeripheryParams,
} from '../types/actionArgTypes';
import {
  BigNumber,
  ContractReceipt,
  ContractTransaction,
  ethers,
} from 'ethers';
import { getPeripheryContract } from '../../common/contract-generators';
import { estimateSettleGasUnits } from '../settle/estimateSettleGasUnits';
import { getGasBuffer } from '../../common/gas/getGasBuffer';
import { getUpdateMarginPeripheryParams } from './getUpdateMarginPeripheryParams';
import { estimateUpdateMarginGasUnits } from './estimateUpdateMarginGasUnits';

export const updateMargin = async ({
  fixedLow,
  fixedHigh,
  margin,
  underlyingTokenAddress,
  underlyingTokenDecimals,
  tickSpacing,
  chainId,
  peripheryAddress,
  marginEngineAddress,
  provider,
  signer,
  fullyWithdraw,
}: UpdateMarginArgs): Promise<ContractReceipt> => {
  const peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    provider,
  );

  peripheryContract.connect(signer);

  const updateMarginPeripheryParams: UpdateMarginPeripheryParams =
    getUpdateMarginPeripheryParams(
      marginEngineAddress,
      fullyWithdraw,
      fixedLow,
      fixedHigh,
      tickSpacing,
      margin,
      underlyingTokenDecimals,
    );

  const updateMarginPeripheryTempOverrides: {
    value?: BigNumber;
    gasLimit?: BigNumber;
  } = {};

  const estimatedGasUnits: BigNumber = await estimateUpdateMarginGasUnits(
    peripheryContract,
    updateMarginPeripheryParams,
    updateMarginPeripheryTempOverrides,
  );

  updateMarginPeripheryTempOverrides.gasLimit = getGasBuffer(estimatedGasUnits);

  const updateMarginTransaction: ContractTransaction = await peripheryContract
    .connect(signer)
    .updatePositionMargin(
      updateMarginPeripheryParams,
      updateMarginPeripheryTempOverrides,
    )
    .catch(() => {
      throw new Error('Update Margin Transaction Confirmation Error');
    });

  const receipt: ContractReceipt = await updateMarginTransaction.wait();

  return receipt;
};
