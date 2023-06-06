import { ExecuteSettleArgs, SettleArgs } from "../types/actionArgTypes";
import {ContractReceipt} from "ethers";
import {PositionInfo} from "../../common/api/position/types";
import {executeSettle} from "./executeSettle";
import {getPositionInfo} from "../../common/api/position/getPositionInfo";

export const settle = async ({
  positionId,
  signer
}: SettleArgs): Promise<ContractReceipt> => {

  const positionInfo: PositionInfo = await getPositionInfo(positionId);

  const receipt: ContractReceipt = await executeSettle({
    positionInfo,
    signer
  });

  return receipt;

}