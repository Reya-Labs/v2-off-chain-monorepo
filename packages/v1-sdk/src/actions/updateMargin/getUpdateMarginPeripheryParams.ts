import { UpdateMarginPeripheryParams } from '../types/actionArgTypes';
import { getClosestTickAndFixedRate } from '../swap/getClosestTickAndFixedRate';
import { scale } from '../../common/math/scale';

export const getUpdateMarginPeripheryParams = (
  marginEngineAddress: string,
  fullyWithdraw: boolean,
  fixedLow: number,
  fixedHigh: number,
  tickSpacing: number,
  marginDelta: number,
  underlyingTokenDecimals: number,
): UpdateMarginPeripheryParams => {
  const updateMarginPeripheryParams: UpdateMarginPeripheryParams = {
    marginEngineAddress: marginEngineAddress,
    tickLower: 0,
    tickUpper: 0,
    marginDelta: 0,
    fullyWithdraw: fullyWithdraw,
  };

  const { closestUsableTick: tickUpper } = getClosestTickAndFixedRate(
    fixedLow,
    tickSpacing,
  );
  const { closestUsableTick: tickLower } = getClosestTickAndFixedRate(
    fixedHigh,
    tickSpacing,
  );

  updateMarginPeripheryParams.tickLower = tickLower;
  updateMarginPeripheryParams.tickUpper = tickUpper;
  updateMarginPeripheryParams.marginDelta = scale(
    marginDelta,
    underlyingTokenDecimals,
  );

  return updateMarginPeripheryParams;
};
