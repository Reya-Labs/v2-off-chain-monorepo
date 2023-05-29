import { LpPeripheryParams, RolloverAndLpPeripheryParams } from "../types/actionArgTypes";
import { getLpPeripheryParams } from "../lp/getLpPeripheryParams";


export type GetRolloverAndLpPeripheryParamsArgs = {
  addLiquidity: boolean;
  margin: number;
  notional: number;
  fixedLow: number;
  fixedHigh: number;
  marginEngineAddress: string;
  underlyingTokenDecimals: number;
  tickSpacing: number;
  maturedMarginEngineAddress: string;
  maturedPositionOwnerAddress: string;
  maturedPositionSettlementBalance: number;
  maturedPositionTickLower: number;
  maturedPositionTickUpper: number;
}


export const getRolloverAndLpPeripheryParams = ({
  addLiquidity,
  margin,
  notional,
  fixedLow,
  fixedHigh,
  marginEngineAddress,
  underlyingTokenDecimals,
  tickSpacing,
  maturedMarginEngineAddress,
  maturedPositionOwnerAddress,
  maturedPositionSettlementBalance,
  maturedPositionTickLower,
  maturedPositionTickUpper
}: GetRolloverAndLpPeripheryParamsArgs): RolloverAndLpPeripheryParams => {

  const newLpPeripheryParams: LpPeripheryParams = getLpPeripheryParams(
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

  const rolloverAndLpPeripheryParams: RolloverAndLpPeripheryParams = {
    maturedMarginEngineAddress: marginEngineAddress,
    maturedPositionOwnerAddress: marginEngineAddress,
    maturedPositionTickLower: maturedPositionTickLower,
    maturedPositionTickUpper: maturedPositionTickUpper,
    newLpPeripheryParams: newLpPeripheryParams
  }

  return rolloverAndLpPeripheryParams;

}