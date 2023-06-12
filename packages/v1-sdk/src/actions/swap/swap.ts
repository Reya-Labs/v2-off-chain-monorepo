import { SwapArgs, SwapPeripheryParams } from '../types/actionArgTypes';
import { BigNumber, ContractReceipt, ContractTransaction, utils } from 'ethers';
import { ethers } from 'ethers';
import { getPeripheryContract } from '../../common/contract-generators/getPeripheryContract';
import { getSwapPeripheryParams } from './getSwapPeripheryParams';
import { estimateSwapGasUnits } from './estimateSwapGasUnits';
import { getGasBuffer } from '../../common/gas/getGasBuffer';
import {
  DEFAULT_TICK_SPACING,
  PERIPHERY_ADDRESS_BY_CHAIN_ID,
} from '../../common/constants';
import { getSentryTracker } from '../../init';
import { getAmmInfo } from '../../common/api/amm/getAmmInfo';
import { AMMInfo } from '../../common/api/amm/types';

export const swap = async ({
  ammId,
  notional,
  margin,
  fixedRateLimit,
  signer,
}: SwapArgs): Promise<ContractReceipt> => {
  if (signer.provider === undefined) {
    throw new Error('Signer Provider Undefined');
  }

  const chainId: number = await signer.getChainId();

  const ammInfo: AMMInfo = await getAmmInfo(ammId, chainId);

  const tickSpacing: number = DEFAULT_TICK_SPACING;

  const peripheryAddress: string = PERIPHERY_ADDRESS_BY_CHAIN_ID[chainId];

  const peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    signer,
  );

  const swapPeripheryParams: SwapPeripheryParams = getSwapPeripheryParams({
    margin,
    isFT: notional > 0,
    notional,
    marginEngineAddress: ammInfo.marginEngineAddress,
    underlyingTokenDecimals: ammInfo.underlyingTokenDecimals,
    fixedRateLimit,
    tickSpacing,
  });

  const swapPeripheryTempOverrides: {
    value?: BigNumber;
    gasLimit?: BigNumber;
  } = {};

  if (ammInfo.isEth && margin > 0) {
    swapPeripheryTempOverrides.value = utils.parseEther(
      margin.toFixed(18).toString(),
    );
  }

  const estimatedGasUnits: BigNumber = await estimateSwapGasUnits(
    peripheryContract,
    swapPeripheryParams,
    swapPeripheryTempOverrides,
  );

  swapPeripheryTempOverrides.gasLimit = getGasBuffer(estimatedGasUnits);

  // todo: find cleaner way to unwrap swapPeripheryParams
  const swapTransaction: ContractTransaction = await peripheryContract
    .swap(
      swapPeripheryParams.marginEngineAddress,
      swapPeripheryParams.isFT,
      swapPeripheryParams.notional,
      swapPeripheryParams.sqrtPriceLimitX96,
      swapPeripheryParams.tickLower,
      swapPeripheryParams.tickUpper,
      swapPeripheryParams.marginDelta,
      swapPeripheryTempOverrides,
    )
    .catch((error: any) => {
      const sentryTracker = getSentryTracker();
      sentryTracker.captureException(error);
      sentryTracker.captureMessage('Transaction Confirmation Error');
      throw new Error('Transaction Confirmation Error');
    });

  try {
    const receipt: ContractReceipt = await swapTransaction.wait();
    return receipt;
  } catch (error) {
    const sentryTracker = getSentryTracker();
    sentryTracker.captureException(error);
    sentryTracker.captureMessage('Transaction Confirmation Error');
    throw new Error('Transaction Confirmation Error');
  }
};
