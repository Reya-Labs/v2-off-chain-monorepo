import { ContractReceipt, ethers } from "ethers";
import {RolloverAndSwapArgs, RolloverAndSwapPeripheryParams} from "../types/actionArgTypes";
import { handleSwapErrors } from "../swap/handleSwapErrors";
import { getPeripheryContract } from "../../common/contract-generators";
import { getRolloverAndSwapPeripheryParams } from "./getRolloverAndSwapPeripheryParams";

export const rolloverAndSwap = async (
  {
    isFT,
    notional,
    margin,
    fixedRateLimit,
    fixedLow,
    fixedHigh,
    underlyingTokenAddress,
    underlyingTokenDecimals,
    tickSpacing,
    chainId,
    peripheryAddress,
    marginEngineAddress,
    provider,
    signer,
    isEth,
    maturedMarginEngineAddress,
    maturedPositionOwnerAddress,
    maturedPositionSettlementBalance,
    maturedPositionTickLower,
    maturedPositionTickUpper

  }: RolloverAndSwapArgs,
): Promise<ContractReceipt> => {

  handleSwapErrors(
    {
      notional,
      fixedLow,
      fixedHigh,
      underlyingTokenAddress,
    }
  );

  const peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    provider,
  );

  peripheryContract.connect(signer);

  const rolloverAndSwapPeripheryParams: RolloverAndSwapPeripheryParams = getRolloverAndSwapPeripheryParams(
    {
      margin,
      isFT,
      notional,
      fixedLow,
      fixedHigh,
      marginEngineAddress,
      underlyingTokenDecimals,
      fixedRateLimit,
      tickSpacing,
      maturedMarginEngineAddress,
      maturedPositionOwnerAddress,
      maturedPositionSettlementBalance,
      maturedPositionTickLower,
      maturedPositionTickUpper
    }
  );




}