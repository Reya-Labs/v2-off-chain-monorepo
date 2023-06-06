import { ExecuteSettleArgs, SettleArgs } from "../types/actionArgTypes";
import {ContractReceipt} from "ethers";
import {PositionInfo} from "../../common/api/position/position";
import {executeSettle} from "./executeSettle";

export const settle = async ({
  positionId,
  signer
}: SettleArgs): Promise<ContractReceipt> => {

  const positionInfo: PositionInfo = await getPositionInfo(positionId);

  const receipt: ContractReceipt = await executeSettle({

}