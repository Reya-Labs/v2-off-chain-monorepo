import { SettlePeripheryParams, UpdateMarginArgs } from "../types/actionArgTypes";
import { BigNumber, ContractReceipt, ContractTransaction, ethers } from "ethers";
import { getPeripheryContract } from "../../common/contract-generators";
import { getSettlePeripheryParams } from "../settle/getSettlePeripheryParams";
import { estimateSettleGasUnits } from "../settle/estimateSettleGasUnits";
import { getGasBuffer } from "../../common/gas/getGasBuffer";


export const updateMargin = async (
  {
    fixedLow,
    fixedHigh,
    margin,
    underlyingTokenAddress,
    underlyingTokenDecimals,
    tickSpacing,
    chainId,
    peripheryAddress,
    marginEngineAddress,
    provider,
    signer
  }: UpdateMarginArgs
): Promise<ContractReceipt> => {
  const peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    provider,
  );

  peripheryContract.connect(signer);

  const updateMarginPeripheryParams: SettlePeripheryParams = getUpdateMarginPeripheryParams();

  const updateMarginPeripheryTempOverrides: {
    value?: BigNumber;
    gasLimit?: BigNumber;
  } = {};

  const estimatedGasUnits: BigNumber = await estimateUpdateMarginGasUnits(
    peripheryContract,
    updateMarginPeripheryParams,
    updateMarginPeripheryTempOverrides,
  );

  updateMarginPeripheryTempOverrides.gasLimit = getGasBuffer(estimatedGasUnits);

  const updateMarginTransaction: ContractTransaction = await peripheryContract
    .connect(signer)
    .updatePositionMargin(
      updateMarginPeripheryParams,
      updateMarginPeripheryTempOverrides,
    )
    .catch(() => {
      throw new Error('Update Margin Transaction Confirmation Error');
    });

  const receipt: ContractReceipt = await updateMarginTransaction.wait();

  return receipt;

}