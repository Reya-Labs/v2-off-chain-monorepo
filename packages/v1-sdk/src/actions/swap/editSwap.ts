import { EditSwapArgs, SwapPeripheryParams } from '../types/actionArgTypes';
import {
  BigNumber,
  ContractReceipt,
  ContractTransaction,
  ethers,
  utils,
} from 'ethers';
import {
  DEFAULT_TICK_SPACING,
  PERIPHERY_ADDRESS_BY_CHAIN_ID,
} from '../../common/constants';
import { getPeripheryContract } from '../../common/contract-generators';
import { getSwapPeripheryParams } from './getSwapPeripheryParams';
import { estimateSwapGasUnits } from './estimateSwapGasUnits';
import { getGasBuffer } from '../../common/gas/getGasBuffer';
import { getSentryTracker } from '../../init';
import { PositionInfo } from '../../common/api/position/types';
import { getPositionInfo } from '../../common/api/position/getPositionInfo';

// todo: refactor since a lot of shared logic with swap and simulateSwap
export const editSwap = async ({
  positionId,
  notional,
  margin,
  fixedRateLimit,
  signer,
}: EditSwapArgs): Promise<ContractReceipt> => {
  if (signer.provider === undefined) {
    throw new Error('Signer Provider Undefined');
  }

  const chainId: number = await signer.getChainId();

  const positionInfo: PositionInfo = await getPositionInfo(positionId);

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
    marginEngineAddress: positionInfo.ammMarginEngineAddress,
    underlyingTokenDecimals: positionInfo.ammUnderlyingTokenDecimals,
    fixedRateLimit,
    tickSpacing,
  });

  const swapPeripheryTempOverrides: {
    value?: BigNumber;
    gasLimit?: BigNumber;
  } = {};

  if (positionInfo.isEth && margin > 0) {
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
