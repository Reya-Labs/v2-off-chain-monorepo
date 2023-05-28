import { LpArgs } from "../types/actionArgTypes";
import { ContractReceipt } from "ethers";


export const lp = async (
  {
    addLiquidity,
    fixedLow,
    fixedHigh,
    notional,
    margin,
    underlyingTokenAddress,
    underlyingTokenDecimals,
    chainId,
    peripheryAddress,
    marginEngineAddress,
    provider,
    signer,
    isEth
  }: LpArgs
):Promise<ContractReceipt> => {
  handleLpErrors({
    signer,
    notional,
    fixedLow,
    fixedHigh
  });

  

}


