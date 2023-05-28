import { LpArgs, LpPeripheryParams } from "../types/actionArgTypes";
import { ContractReceipt, ethers } from "ethers";
import {handleLpErrors} from "./handleLpErrors";
import { getPeripheryContract } from "../../common/contract-generators";

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
    notional,
    fixedLow,
    fixedHigh
  });

  let peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    provider
  );

  peripheryContract.connect(signer);

  const lpPeripheryParams: LpPeripheryParams = getLpPeripheryParams();

}


