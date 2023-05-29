import { LpPeripheryParams } from '../types/actionArgTypes';
import { getClosestTickAndFixedRate } from '../swap/getClosestTickAndFixedRate';
import { scale } from '../../common/math/scale';

export type GetLpPeripheryParamsArgs = {
  addLiquidity: boolean;
  margin: number;
  notional: number;
  fixedLow: number;
  fixedHigh: number;
  marginEngineAddress: string;
  underlyingTokenDecimals: number;
  tickSpacing: number;
};

export const getLpPeripheryParams = ({
  addLiquidity,
  margin,
  notional,
  fixedLow,
  fixedHigh,
  marginEngineAddress,
  underlyingTokenDecimals,
  tickSpacing,
}: GetLpPeripheryParamsArgs): LpPeripheryParams => {
  const lpPeripheryParams: LpPeripheryParams = {
    isMint: addLiquidity,
    marginEngineAddress: marginEngineAddress,
    notional: 0,
    tickLower: 0,
    tickUpper: 0,
    marginDelta: 0,
  };

  const { closestUsableTick: tickUpper } = getClosestTickAndFixedRate(
    fixedLow,
    tickSpacing,
  );
  const { closestUsableTick: tickLower } = getClosestTickAndFixedRate(
    fixedHigh,
    tickSpacing,
  );

  lpPeripheryParams.notional = scale(notional, underlyingTokenDecimals);
  lpPeripheryParams.marginDelta = scale(margin, underlyingTokenDecimals);
  lpPeripheryParams.tickLower = tickLower;
  lpPeripheryParams.tickUpper = tickUpper;

  return lpPeripheryParams;
};
