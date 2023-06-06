import { ExecuteOrSimulateSettleArgs } from "../types/actionArgTypes";
import { ContractReceipt } from "ethers";
import { SettleSimulationResults } from "./types";

export const simulateSettle =  async ({
  positionInfo,
  signer
}: ExecuteOrSimulateSettleArgs): Promise<SettleSimulationResults> => {



}