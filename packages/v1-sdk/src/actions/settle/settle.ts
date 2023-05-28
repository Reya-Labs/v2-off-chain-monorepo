import { ContractReceipt, ethers, BigNumber, utils, ContractTransaction } from "ethers";
import { SettleArgs, SettlePeripheryParams } from "../types/actionArgTypes";
import { getPeripheryContract } from "../../common/contract-generators";
import {getGasBuffer} from "../../common/gas/getGasBuffer";
import { getSettlePeripheryParams } from "./getSettlePeripheryParams";
import { estimateSettleGasUnits } from "./estimateSettleGasUnits";

export const settle = async (
  {
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
    positionOwnerAddress
  }: SettleArgs
): Promise<ContractReceipt> => {

  let peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    provider
  );

  peripheryContract.connect(signer);

  const settlePeripheryParams: SettlePeripheryParams = getSettlePeripheryParams(
      marginEngineAddress,
      positionOwnerAddress,
      fixedLow,
      fixedHigh,
      tickSpacing
  );

  const settlePeripheryTempOverrides: { value?: BigNumber; gasLimit?: BigNumber } = {};

  const estimatedGasUnits: BigNumber = await estimateSettleGasUnits(
    peripheryContract,
    settlePeripheryParams,
    settlePeripheryTempOverrides
  );

  settlePeripheryTempOverrides.gasLimit = getGasBuffer(estimatedGasUnits);

  const settleTransaction: ContractTransaction = await peripheryContract.connect(signer).settlePositionAndWithdrawMargin(
    settlePeripheryParams, settlePeripheryTempOverrides
  ).catch(() => {
    throw new Error('Settle Transaction Confirmation Error');
  });

  const receipt: ContractReceipt  = await settleTransaction.wait();

  return receipt;

}
