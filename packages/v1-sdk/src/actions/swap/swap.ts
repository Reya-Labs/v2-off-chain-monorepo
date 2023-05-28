import { SwapArgs, SwapPeripheryParams } from '../types/actionArgTypes';
import { BigNumber, ContractReceipt, ContractTransaction, utils } from 'ethers';
import { handleSwapErrors } from './handleSwapErrors';
import { BigNumberish, ethers } from 'ethers';
import { getClosestTickAndFixedRate } from './getClosestTickAndFixedRate';
import { getSqrtPriceLimitFromFixedRateLimit } from './getSqrtPriceLimitFromFixedRate';
import { getDefaultSqrtPriceLimit } from './getDefaultSqrtPriceLimits';
import { getPeripheryContract } from '../../common/contract-generators/getPeripheryContract';
import { getSwapPeripheryParams } from './getSwapPeripheryParams';
import { estimateSwapGasUnits } from './estimateSwapGasUnits';
import { getGasBuffer } from '../../common/gas/getGasBuffer';

// todo: add option to simulate a swap, same goes for other actions
export const swap = async ({
  isFT,
  notional,
  margin,
  fixedRateLimit,
  fixedLow,
  fixedHigh,
  underlyingTokenAddress,
  underlyingTokenDecimals,
  tickSpacing,
  peripheryAddress,
  marginEngineAddress,
  provider,
  signer,
  isEth,
}: SwapArgs): Promise<ContractReceipt> => {
  handleSwapErrors({
    notional,
    fixedLow,
    fixedHigh,
    underlyingTokenAddress,
  });

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
    marginEngineAddress,
    underlyingTokenDecimals,
    fixedRateLimit,
    tickSpacing,
  });

  // need to be careful to make sure we don't double count margin, may need to refactor
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

  const swapTransaction: ContractTransaction = await peripheryContract
    .connect(signer)
    .swap(swapPeripheryParams, swapPeripheryTempOverrides)
    .catch(() => {
      throw new Error('Swap Transaction Confirmation Error');
    });

  const receipt: ContractReceipt = await swapTransaction.wait();

  return receipt;
};
