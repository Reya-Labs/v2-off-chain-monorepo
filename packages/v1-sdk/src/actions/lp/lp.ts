import { LpArgs, LpPeripheryParams } from "../types/actionArgTypes";
import { BigNumber, ContractReceipt, ethers, utils } from "ethers";
import {handleLpErrors} from "./handleLpErrors";
import { getPeripheryContract } from "../../common/contract-generators";
import { getLpPeripheryParams } from "./getLpPeripheryParams";
import { estimateSwapGasUnits } from "../swap/estimateSwapGasUnits";
import { getGasBuffer } from "../../common/gas/getGasBuffer";

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
    tickSpacing,
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

  const lpPeripheryParams: LpPeripheryParams = getLpPeripheryParams(
    {
      addLiquidity,
      margin,
      notional,
      fixedLow,
      fixedHigh,
      marginEngineAddress,
      underlyingTokenDecimals,
      tickSpacing
    }
  );

  const lpPeripheryTempOverrides: { value?: ethers.BigNumber; gasLimit?: ethers.BigNumber } = {}

  if (isEth && margin > 0) {
    lpPeripheryTempOverrides.value = utils.parseEther(margin.toFixed(18).toString());
  }

  const estimatedGasUnits: BigNumber = await estimateLpGasUnits(
    peripheryContract,
    lpPeripheryParams,
    lpPeripheryTempOverrides
  );

  lpPeripheryTempOverrides.gasLimit = getGasBuffer(estimatedGasUnits);

  const tx: ethers.ContractTransaction = await peripheryContract.lp(
    lpPeripheryParams, lpPeripheryTempOverrides
  ).catch(() => {
    throw new Error('LP Transaction Confirmation Error');
  });

  const receipt: ContractReceipt = await tx.wait();

  return receipt;

}


