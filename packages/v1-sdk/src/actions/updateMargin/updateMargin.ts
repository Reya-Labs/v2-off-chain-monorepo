import {
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
import { getGasBuffer } from '../../common/gas/getGasBuffer';
import { estimateUpdateMarginGasUnits } from './estimateUpdateMarginGasUnits';
import { PositionInfo } from '../../common/api/position/types';
import { getPositionInfo } from '../../common/api/position/getPositionInfo';
import { PERIPHERY_ADDRESS_BY_CHAIN_ID } from '../../common/constants';
import { scale } from '../../common/math/scale';
import { getReadableErrorMessage } from '../../common/errors/errorHandling';
import { getSentryTracker } from '../../init';
import { decodeV1PositionId } from '@voltz-protocol/commons-v2/dist/types';

export const updateMargin = async ({
  positionId,
  margin,
  signer,
}: UpdateMarginArgs): Promise<ContractReceipt> => {
  const positionInfo: PositionInfo = await getPositionInfo(positionId);

  const { chainId } = decodeV1PositionId(positionId);

  const peripheryAddress = PERIPHERY_ADDRESS_BY_CHAIN_ID[chainId];

  const peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    signer,
  );

  const updateMarginPeripheryParams: UpdateMarginPeripheryParams = {
    marginEngineAddress: positionInfo.ammMarginEngineAddress,
    tickLower: positionInfo.positionTickLower,
    tickUpper: positionInfo.positionTickUpper,
    marginDelta: scale(margin, positionInfo.ammUnderlyingTokenDecimals),
    fullyWithdraw: false,
  };

  const updateMarginPeripheryTempOverrides: {
    value?: BigNumber;
    gasLimit?: BigNumber;
  } = {};

  await peripheryContract.callStatic
    .updatePositionMargin(
      updateMarginPeripheryParams.marginEngineAddress,
      updateMarginPeripheryParams.tickLower,
      updateMarginPeripheryParams.tickUpper,
      updateMarginPeripheryParams.marginDelta,
      updateMarginPeripheryParams.fullyWithdraw,
      updateMarginPeripheryTempOverrides,
    )
    .catch((error: any) => {
      const errorMessage = getReadableErrorMessage(error);
      throw new Error(errorMessage);
    });

  const estimatedGasUnits: BigNumber = await estimateUpdateMarginGasUnits(
    peripheryContract,
    updateMarginPeripheryParams,
    updateMarginPeripheryTempOverrides,
  );

  updateMarginPeripheryTempOverrides.gasLimit = getGasBuffer(estimatedGasUnits);

  const updateMarginTransaction: ContractTransaction = await peripheryContract
    .updatePositionMargin(
      updateMarginPeripheryParams.marginEngineAddress,
      updateMarginPeripheryParams.tickLower,
      updateMarginPeripheryParams.tickUpper,
      updateMarginPeripheryParams.marginDelta,
      updateMarginPeripheryParams.fullyWithdraw,
      updateMarginPeripheryTempOverrides,
    )
    .catch((error: any) => {
      const sentryTracker = getSentryTracker();
      sentryTracker.captureException(error);
      sentryTracker.captureMessage('Transaction Confirmation Error');
      throw new Error('Transaction Confirmation Error');
    });

  try {
    const receipt = await updateMarginTransaction.wait();
    return receipt;
  } catch (error) {
    const sentryTracker = getSentryTracker();
    sentryTracker.captureException(error);
    sentryTracker.captureMessage('Transaction Confirmation Error');
    throw new Error('Transaction Confirmation Error');
  }
};
