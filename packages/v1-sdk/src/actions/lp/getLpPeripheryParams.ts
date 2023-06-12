import { LpPeripheryParams } from '../types/actionArgTypes';
import { getClosestTickAndFixedRate } from '../../common/math/getClosestTickAndFixedRate';
import { scale } from '../../common/math/scale';

export type GetLpPeripheryParamsArgs = {
  margin: number;
  notional: number;
  fixedLow: number;
  fixedHigh: number;
  marginEngineAddress: string;
  underlyingTokenDecimals: number;
  tickSpacing: number;
};

export const getLpPeripheryParams = ({
  margin,
  notional,
  fixedLow,
  fixedHigh,
  marginEngineAddress,
  underlyingTokenDecimals,
  tickSpacing,
}: GetLpPeripheryParamsArgs): LpPeripheryParams => {
  const lpPeripheryParams: LpPeripheryParams = {
    isMint: notional > 0,
    marginEngineAddress: marginEngineAddress,
    notional: scale(notional, underlyingTokenDecimals),
    tickLower: getClosestTickAndFixedRate(fixedHigh, tickSpacing)
      .closestUsableTick,
    tickUpper: getClosestTickAndFixedRate(fixedLow, tickSpacing)
      .closestUsableTick,
    marginDelta: scale(margin, underlyingTokenDecimals),
  };

  return lpPeripheryParams;
};
