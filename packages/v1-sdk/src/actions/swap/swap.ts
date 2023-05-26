import { SwapArgs, SwapPeripheryParams } from "../types/actionArgTypes";
import {BigNumber, utils} from "ethers";
import { SwapResponse } from '../actionResponseTypes';
import { handleSwapErrors } from './handleSwapErrors';
import { BigNumberish, ethers } from "ethers";
import { getClosestTickAndFixedRate } from "./getClosestTickAndFixedRate";
import { getSqrtPriceLimitFromFixedRateLimit } from "./getSqrtPriceLimitFromFixedRate";
import { getDefaultSqrtPriceLimit} from "./getDefaultSqrtPriceLimits";
import { executeSwap } from "./executeSwap";
import {getPeripheryContract} from "../../common/contract-generators/getPeripheryContract";
import { getSwapPeripheryParams } from "./getSwapPeripheryParams";
import { estimateSwapGasUnits } from "./estimateSwapGasUnits";
import { getGasBuffer } from "../../common/gas/getGasBuffer";

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
  isEth
}: SwapArgs): Promise<SwapResponse> => {
  // todo: layer in validation of tick spacing in handle swap errors or better turn into an enum
  handleSwapErrors({
    notional,
    fixedLow,
    fixedHigh,
    underlyingTokenAddress
  });

  let peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    provider
  );

  peripheryContract.connect(signer);

  const swapPeripheryParams: SwapPeripheryParams = getSwapPeripheryParams(
    {
      margin,
      isFT,
      notional,
      fixedLow,
      fixedHigh,
      marginEngineAddress,
      underlyingTokenDecimals,
      fixedRateLimit,
      tickSpacing
    }
  );

  // need to be careful to make sure we don't double count margin, may need to refactor
  // todo :{ value?: BigNumber; gasLimit?: BigNumber }  looks ugly, can we not use a type?
  const swapPeripheryTempOverrides: { value?: BigNumber; gasLimit?: BigNumber } = {}

  // todo: consider placing this logic elsewhere
  if (isEth && margin > 0) {
    swapPeripheryTempOverrides.value = utils.parseEther(margin.toFixed(18).toString());
  }

  const estimatedGasUnits = await estimateSwapGasUnits(
    peripheryContract,
    swapPeripheryParams,
    swapPeripheryTempOverrides
  );

  swapPeripheryTempOverrides.gasLimit = getGasBuffer(estimatedGasUnits);

  return await executeSwap(swapPeripheryParams);

};
