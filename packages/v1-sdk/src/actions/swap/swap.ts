import { SwapArgs, SwapPeripheryParams } from '../types/actionArgTypes';
import {
  BigNumber,
  ContractReceipt,
  ContractTransaction,
  providers,
  utils,
} from 'ethers';
import { handleSwapErrors } from './handleSwapErrors';
import { BigNumberish, ethers } from 'ethers';
import { getClosestTickAndFixedRate } from '../../common/math/getClosestTickAndFixedRate';
import { getSqrtPriceLimitFromFixedRateLimit } from '../../common/math/getSqrtPriceLimitFromFixedRate';
import { getDefaultSqrtPriceLimit } from '../../common/math/getDefaultSqrtPriceLimits';
import { getPeripheryContract } from '../../common/contract-generators/getPeripheryContract';
import { getSwapPeripheryParams } from './getSwapPeripheryParams';
import { estimateSwapGasUnits } from './estimateSwapGasUnits';
import { getGasBuffer } from '../../common/gas/getGasBuffer';
import {
  DEFAULT_TICK_SPACING,
  PERIPHERY_ADDRESS_BY_CHAIN_ID,
} from '../../common/constants';
import { getReadableErrorMessage } from '../../common/errors/errorHandling';
import { getSentryTracker } from '../../init';

export const swap = async ({
  isFT,
  isEth,
  notional,
  margin,
  fixedRateLimit,
  fixedLow,
  fixedHigh,
  ammInfo,
  signer,
}: SwapArgs): Promise<ContractReceipt> => {
  handleSwapErrors({
    notional,
    fixedLow,
    fixedHigh,
    underlyingTokenAddress: ammInfo.underlyingTokenAddress,
  });

  const tickSpacing: number = DEFAULT_TICK_SPACING;

  const chainId: number = await signer.getChainId();
  const provider: providers.Provider = signer.provider;

  const peripheryAddress: string = PERIPHERY_ADDRESS_BY_CHAIN_ID[chainId];

  const peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    provider,
  );

  peripheryContract.connect(signer);

  const swapPeripheryParams: SwapPeripheryParams = getSwapPeripheryParams({
    margin,
    isFT,
    notional,
    fixedLow,
    fixedHigh,
    marginEngineAddress: ammInfo.marginEngineAddress,
    underlyingTokenDecimals: ammInfo.underlyingTokenDecimals,
    fixedRateLimit,
    tickSpacing,
  });

  const swapPeripheryTempOverrides: {
    value?: BigNumber;
    gasLimit?: BigNumber;
  } = {};

  if (isEth && margin > 0) {
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

  // todo: find a cleaner way to unwrap swapPeripheryParams
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
    .catch((error) => {
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
