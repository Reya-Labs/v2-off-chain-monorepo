import { LpPeripheryParams } from "../types/actionArgTypes";

export type GetLpPeripheryParamsArgs = {
  margin: number;
  notional: number;
  fixedLow: number;
  fixedHigh: number;
  marginEngineAddress: string;
  underlyingTokenDecimals: number;
  tickSpacing: number;
};



export const getLpPeripheryParams = (
  {}: GetLpPeripheryParamsArgs
): LpPeripheryParams => {


}