import { ExecuteSettleArgs, SettleArgs } from "../types/actionArgTypes";
import {ContractReceipt} from "ethers";

export const settle = async ({
  positionId,
  signer
}: SettleArgs): Promise<ContractReceipt> => {

  // need to get tickLower, tickUpper, underlyingTokenAddress,
  // underlyingTokenDecimals, tickSpacing, marginEngineAddress

  const positionInfo = await getPositionInfo(positionId);

}