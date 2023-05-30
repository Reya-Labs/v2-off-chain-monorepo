import { BigNumber, ContractReceipt, ContractTransaction, ethers } from "ethers";
import {RolloverAndLpArgs, RolloverAndLpPeripheryParams} from "../types/actionArgTypes";
import {handleLpErrors} from "../lp/handleLpErrors";
import { getPeripheryContract } from "../../common/contract-generators";
import { getRolloverAndLpPeripheryParams } from "./getRolloverAndLpPeripheryParams";
import { getGasBuffer } from "../../common/gas/getGasBuffer";
import { estimateRolloverAndLpGasUnits } from "./estimateRolloverAndSwapGasUnits";


export const rolloverAndLp = async (
  {
  }
): Promise<ContractReceipt> => {

}