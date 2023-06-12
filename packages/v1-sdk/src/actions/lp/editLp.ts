import { EditLpArgs, LpPeripheryParams } from '../types';
import { BigNumber, ContractReceipt, ethers, utils } from 'ethers';
import {
  decodePositionId,
  DecodedPosition,
} from '../../common/api/position/decodePositionId';
import {
  NUMBER_OF_DECIMALS_ETHER,
  PERIPHERY_ADDRESS_BY_CHAIN_ID,
} from '../../common/constants';
import { getPeripheryContract } from '../../common/contract-generators';
import { PositionInfo } from '../../common/api/position/types';
import { getPositionInfo } from '../../common/api/position/getPositionInfo';
import { getReadableErrorMessage } from '../../common/errors/errorHandling';
import { estimateLpGasUnits } from './estimateLpGasUnits';
import { getGasBuffer } from '../../common/gas/getGasBuffer';
import { getSentryTracker } from '../../init';

export const editLp = async ({
  positionId,
  notional,
  margin,
  signer,
}: EditLpArgs): Promise<ContractReceipt> => {
  const decodedPosition: DecodedPosition = decodePositionId(positionId);
  const positionInfo: PositionInfo = await getPositionInfo(positionId);
  const peripheryAddress =
    PERIPHERY_ADDRESS_BY_CHAIN_ID[decodedPosition.chainId];
  const peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    signer,
  );
  const lpPeripheryParams: LpPeripheryParams = {
    marginEngineAddress: positionInfo.ammMarginEngineAddress,
    isMint: notional > 0,
    tickLower: decodedPosition.tickLower,
    tickUpper: decodedPosition.tickUpper,
    marginDelta: margin,
    notional: notional,
  };

  const lpPeripheryTempOverrides: {
    value?: ethers.BigNumber;
    gasLimit?: ethers.BigNumber;
  } = {};

  if (positionInfo.isEth && margin > 0) {
    lpPeripheryTempOverrides.value = utils.parseEther(
      margin.toFixed(NUMBER_OF_DECIMALS_ETHER).toString(),
    );
  }

  await peripheryContract.callStatic
    .mintOrBurn(
      lpPeripheryParams.marginEngineAddress,
      lpPeripheryParams.tickLower,
      lpPeripheryParams.tickUpper,
      lpPeripheryParams.notional,
      lpPeripheryParams.isMint,
      lpPeripheryParams.marginDelta,
      lpPeripheryTempOverrides,
    )
    .catch((error: any) => {
      const errorMessage = getReadableErrorMessage(error);
      throw new Error(errorMessage);
    });

  const estimatedGasUnits: BigNumber = await estimateLpGasUnits(
    peripheryContract,
    lpPeripheryParams,
    lpPeripheryTempOverrides,
  );

  lpPeripheryTempOverrides.gasLimit = getGasBuffer(estimatedGasUnits);

  const lpTransaction: ethers.ContractTransaction = await peripheryContract
    .mintOrBurn(
      lpPeripheryParams.marginEngineAddress,
      lpPeripheryParams.tickLower,
      lpPeripheryParams.tickUpper,
      lpPeripheryParams.notional,
      lpPeripheryParams.isMint,
      lpPeripheryParams.marginDelta,
      lpPeripheryTempOverrides,
    )
    .catch((error: any) => {
      const sentryTracker = getSentryTracker();
      sentryTracker.captureException(error);
      sentryTracker.captureMessage('Transaction Confirmation Error');
      throw new Error('Transaction Confirmation Error');
    });

  try {
    const receipt = await lpTransaction.wait();
    return receipt;
  } catch (error) {
    const sentryTracker = getSentryTracker();
    sentryTracker.captureException(error);
    sentryTracker.captureMessage('Transaction Confirmation Error');
    throw new Error('Transaction Confirmation Error');
  }
};
