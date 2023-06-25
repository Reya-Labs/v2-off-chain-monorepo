import {
  BigNumber,
  ContractReceipt,
  ContractTransaction,
  ethers,
} from 'ethers';
import {
  RolloverWithSwapArgs,
  RolloverWithSwapPeripheryParams,
} from '../types/actionArgTypes';
import { getPeripheryContract } from '../../common/contract-generators';
import { getRolloverWithSwapPeripheryParams } from './getRolloverWithSwapPeripheryParams';
import { getGasBuffer } from '../../common/gas/getGasBuffer';
import { estimateRolloverWithSwapGasUnits } from './estimateRolloverWithSwapGasUnits';
import { PositionInfo } from '../../common/api/position/types';
import { getPositionInfo } from '../../common/api/position/getPositionInfo';
import {
  DEFAULT_TICK_SPACING,
  PERIPHERY_ADDRESS_BY_CHAIN_ID,
} from '../../common/constants';
import { getAmmInfo } from '../../common/api/amm/getAmmInfo';
import { AMMInfo } from '../../common/api/amm/types';
import { getSentryTracker } from '../../init';

export const rolloverWithSwap = async ({
  maturedPositionId,
  ammId,
  notional,
  margin,
  fixedRateLimit,
  signer,
}: RolloverWithSwapArgs): Promise<ContractReceipt> => {
  const maturedPositionInfo: PositionInfo = await getPositionInfo(
    maturedPositionId,
  );

  const rolloverAmmInfo: AMMInfo = await getAmmInfo(ammId);

  const peripheryAddress =
    PERIPHERY_ADDRESS_BY_CHAIN_ID[maturedPositionInfo.chainId];

  const peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    signer,
  );

  const rolloverWithSwapPeripheryTempOverrides: {
    value?: BigNumber;
    gasLimit?: BigNumber;
  } = {};

  // todo: make sure below logic is correct
  const maturedPositionSettlementBalance: number =
    maturedPositionInfo.margin + maturedPositionInfo.realizedPNLTotal;

  let marginDelta = margin;
  if (maturedPositionInfo.isEth && maturedPositionSettlementBalance < margin) {
    marginDelta = maturedPositionSettlementBalance;
    rolloverWithSwapPeripheryTempOverrides.value = BigNumber.from(
      margin - maturedPositionSettlementBalance,
    );
  }
  const tickSpacing: number = DEFAULT_TICK_SPACING;

  const rolloverAndSwapPeripheryParams: RolloverWithSwapPeripheryParams =
    getRolloverWithSwapPeripheryParams({
      margin: marginDelta,
      isFT: notional < 0,
      notional,
      marginEngineAddress: rolloverAmmInfo.marginEngineAddress,
      underlyingTokenDecimals: rolloverAmmInfo.underlyingTokenDecimals,
      fixedRateLimit,
      tickSpacing,
      maturedPosition: maturedPositionInfo,
    });

  const estimatedGasUnits: BigNumber = await estimateRolloverWithSwapGasUnits(
    peripheryContract,
    rolloverAndSwapPeripheryParams,
    rolloverWithSwapPeripheryTempOverrides,
  );

  rolloverWithSwapPeripheryTempOverrides.gasLimit =
    getGasBuffer(estimatedGasUnits);

  const rolloverWithSwapTransaction: ContractTransaction =
    await peripheryContract
      .rolloverWithSwap(
        rolloverAndSwapPeripheryParams.maturedMarginEngineAddress,
        rolloverAndSwapPeripheryParams.maturedPositionOwnerAddress,
        rolloverAndSwapPeripheryParams.maturedPositionTickLower,
        rolloverAndSwapPeripheryParams.maturedPositionTickUpper,
        rolloverAndSwapPeripheryParams.newSwapPeripheryParams
          .marginEngineAddress,
        rolloverAndSwapPeripheryParams.newSwapPeripheryParams.isFT,
        rolloverAndSwapPeripheryParams.newSwapPeripheryParams.notional,
        rolloverAndSwapPeripheryParams.newSwapPeripheryParams.sqrtPriceLimitX96,
        rolloverAndSwapPeripheryParams.newSwapPeripheryParams.tickLower,
        rolloverAndSwapPeripheryParams.newSwapPeripheryParams.tickUpper,
        rolloverAndSwapPeripheryParams.newSwapPeripheryParams.marginDelta,
        rolloverWithSwapPeripheryTempOverrides,
      )
      .catch((error: any) => {
        const sentryTracker = getSentryTracker();
        sentryTracker.captureException(error);
        sentryTracker.captureMessage('Transaction Confirmation Error');
        throw new Error('Transaction Confirmation Error');
      });

  try {
    const receipt = await rolloverWithSwapTransaction.wait();
    return receipt;
  } catch (error) {
    const sentryTracker = getSentryTracker();
    sentryTracker.captureException(error);
    sentryTracker.captureMessage('Transaction Confirmation Error');
    throw new Error('Transaction Confirmation Error');
  }
};
