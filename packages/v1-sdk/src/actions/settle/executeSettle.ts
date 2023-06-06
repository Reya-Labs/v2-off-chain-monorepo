import {
  ContractReceipt,
  ethers,
  BigNumber,
  utils,
  ContractTransaction, providers
} from "ethers";
import { SettleArgs, SettlePeripheryParams } from "../types/actionArgTypes";
import { getPeripheryContract } from '../../common/contract-generators';
import { getGasBuffer } from '../../common/gas/getGasBuffer';
import { estimateSettleGasUnits } from './estimateSettleGasUnits';
import { PERIPHERY_ADDRESS_BY_CHAIN_ID} from "../../common/constants";
import { PositionInfo } from "../../common/api/position/types";
import { getPositionInfo } from "../../common/api/position/getPositionInfo";

export const executeSettle = async ({
  positionId,
  signer
}: SettleArgs): Promise<ContractReceipt> => {

  if (signer.provider === undefined) {
    throw new Error('Signer Provider Undefined');
  }

  const positionInfo: PositionInfo = await getPositionInfo(positionId);

  const chainId: number = await signer.getChainId();

  const peripheryAddress: string = PERIPHERY_ADDRESS_BY_CHAIN_ID[chainId];

  const positionOwnerAddress: string = await signer.getAddress();

  const provider: providers.Provider = signer.provider;

  const peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    provider,
  );

  peripheryContract.connect(signer);

  const settlePeripheryParams: SettlePeripheryParams = {
    marginEngineAddress: positionInfo.ammMarginEngineAddress,
    positionOwnerAddress: positionOwnerAddress,
    tickLower: positionInfo.positionTickLower,
    tickUpper: positionInfo.positionTickUpper,
  };

  const settlePeripheryTempOverrides: {
    value?: BigNumber;
    gasLimit?: BigNumber;
  } = {};

  const estimatedGasUnits: BigNumber = await estimateSettleGasUnits(
    peripheryContract,
    settlePeripheryParams,
    settlePeripheryTempOverrides,
  );

  settlePeripheryTempOverrides.gasLimit = getGasBuffer(estimatedGasUnits);

  const settleTransaction: ContractTransaction = await peripheryContract
    .connect(signer)
    .settlePositionAndWithdrawMargin(
      settlePeripheryParams,
      settlePeripheryTempOverrides,
    )
    .catch(() => {
      throw new Error('Settle Transaction Confirmation Error');
    });

  const receipt: ContractReceipt = await settleTransaction.wait();

  return receipt;
};
