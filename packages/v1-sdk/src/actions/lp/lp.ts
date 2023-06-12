import { LpArgs, LpPeripheryParams } from '../types/actionArgTypes';
import { BigNumber, ContractReceipt, ethers, utils } from 'ethers';
import { handleLpErrors } from './handleLpErrors';
import { getPeripheryContract } from '../../common/contract-generators';
import { getLpPeripheryParams } from './getLpPeripheryParams';
import { getGasBuffer } from '../../common/gas/getGasBuffer';
import { estimateLpGasUnits } from './estimateLpGasUnits';
import {
  DEFAULT_TICK_SPACING,
  NUMBER_OF_DECIMALS_ETHER,
  PERIPHERY_ADDRESS_BY_CHAIN_ID,
} from '../../common/constants';
import { AMMInfo } from '../../common/api/amm/types';
import { getAmmInfo } from '../../common/api/amm/getAmmInfo';
import { getReadableErrorMessage } from '../../common/errors/errorHandling';
import { getSentryTracker } from '../../init';

export const lp = async ({
  ammId,
  fixedLow,
  fixedHigh,
  notional,
  margin,
  signer,
}: LpArgs): Promise<ContractReceipt> => {
  handleLpErrors({
    notional,
    fixedLow,
    fixedHigh,
  });

  const chainId: number = await signer.getChainId();
  const ammInfo: AMMInfo = await getAmmInfo(ammId, chainId);
  const tickSpacing: number = DEFAULT_TICK_SPACING;

  const peripheryAddress = PERIPHERY_ADDRESS_BY_CHAIN_ID[chainId];

  const peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    signer,
  );

  const lpPeripheryParams: LpPeripheryParams = getLpPeripheryParams({
    margin,
    notional,
    fixedLow,
    fixedHigh,
    marginEngineAddress: ammInfo.marginEngineAddress,
    underlyingTokenDecimals: ammInfo.underlyingTokenDecimals,
    tickSpacing,
  });

  const lpPeripheryTempOverrides: {
    value?: ethers.BigNumber;
    gasLimit?: ethers.BigNumber;
  } = {};

  if (ammInfo.isEth && margin > 0) {
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
