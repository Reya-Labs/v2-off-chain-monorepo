import { ContractReceipt, ethers } from "ethers";
import {RolloverAndSwapArgs, RolloverAndSwapPeripheryParams} from "../types/actionArgTypes";
import { handleSwapErrors } from "../swap/handleSwapErrors";
import { getPeripheryContract } from "../../common/contract-generators";

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
    rolloverPositionSettlementBalance,
    rolloverPositionTickLower,
    rolloverPositionTickUpper

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




}