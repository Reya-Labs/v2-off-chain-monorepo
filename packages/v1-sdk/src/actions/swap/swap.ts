import { SwapArgs, SwapPeripheryParams } from '../types/actionArgTypes';
import { BigNumber, ContractReceipt, ContractTransaction, providers, utils } from "ethers";
import { handleSwapErrors } from './handleSwapErrors';
import { BigNumberish, ethers } from 'ethers';
import { getClosestTickAndFixedRate } from '../../common/math/getClosestTickAndFixedRate';
import { getSqrtPriceLimitFromFixedRateLimit } from '../../common/math/getSqrtPriceLimitFromFixedRate';
import { getDefaultSqrtPriceLimit } from '../../common/math/getDefaultSqrtPriceLimits';
import { getPeripheryContract } from '../../common/contract-generators/getPeripheryContract';
import { getSwapPeripheryParams } from './getSwapPeripheryParams';
import { estimateSwapGasUnits } from './estimateSwapGasUnits';
import { getGasBuffer } from '../../common/gas/getGasBuffer';
import {DEFAULT_TICK_SPACING, PERIPHERY_ADDRESS_BY_CHAIN_ID} from "../../common/constants";

export const swap = async ({
  isFT,
  isEth,
  notional,
  margin,
  fixedRateLimit,
  fixedLow,
  fixedHigh,
  ammInfo,
  signer
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

  const swapTransaction: ContractTransaction = await peripheryContract
    .connect(signer)
    .swap(swapPeripheryParams, swapPeripheryTempOverrides)
    .catch(() => {
      throw new Error('Swap Transaction Confirmation Error');
    });

  const receipt: ContractReceipt = await swapTransaction.wait();

  return receipt;
};
