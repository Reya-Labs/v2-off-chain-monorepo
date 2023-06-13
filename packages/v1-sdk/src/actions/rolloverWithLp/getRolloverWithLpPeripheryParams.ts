import {
  LpPeripheryParams,
  RolloverAndLpPeripheryParams,
} from '../types/actionArgTypes';
import { getLpPeripheryParams } from '../lp/getLpPeripheryParams';
import { PositionInfo } from '../../common/api/position/types';

export type GetRolloverAndLpPeripheryParamsArgs = {
  margin: number;
  notional: number;
  fixedLow: number;
  fixedHigh: number;
  marginEngineAddress: string;
  tickSpacing: number;
  maturedPositionInfo: PositionInfo;
};

export const getRolloverWithLpPeripheryParams = ({
  margin,
  notional,
  fixedLow,
  fixedHigh,
  marginEngineAddress,
  tickSpacing,
  maturedPositionInfo,
}: GetRolloverAndLpPeripheryParamsArgs): RolloverAndLpPeripheryParams => {
  const newLpPeripheryParams: LpPeripheryParams = getLpPeripheryParams({
    margin,
    notional,
    fixedLow,
    fixedHigh,
    marginEngineAddress,
    underlyingTokenDecimals: maturedPositionInfo.ammUnderlyingTokenDecimals,
    tickSpacing,
  });

  const rolloverAndLpPeripheryParams: RolloverAndLpPeripheryParams = {
    maturedMarginEngineAddress: maturedPositionInfo.ammMarginEngineAddress,
    maturedPositionOwnerAddress: maturedPositionInfo.positionOwnerAddress,
    maturedPositionTickLower: maturedPositionInfo.positionTickLower,
    maturedPositionTickUpper: maturedPositionInfo.positionTickUpper,
    newLpPeripheryParams: newLpPeripheryParams,
  };

  return rolloverAndLpPeripheryParams;
};
