import {
  LpPeripheryParams,
  SettlePeripheryParams,
} from '../types/actionArgTypes';
import { getClosestTickAndFixedRate } from '../swap/getClosestTickAndFixedRate';
import { scale } from '../../common/math/scale';

export const getSettlePeripheryParams = (
  marginEngineAddress: string,
  positionOwnerAddress: string,
  fixedLow: number,
  fixedHigh: number,
  tickSpacing: number,
): SettlePeripheryParams => {
  const settlePeripheryParams: SettlePeripheryParams = {
    marginEngineAddress: marginEngineAddress,
    positionOwnerAddress: positionOwnerAddress,
    tickLower: 0,
    tickUpper: 0,
  };

  const { closestUsableTick: tickUpper } = getClosestTickAndFixedRate(
    fixedLow,
    tickSpacing,
  );
  const { closestUsableTick: tickLower } = getClosestTickAndFixedRate(
    fixedHigh,
    tickSpacing,
  );

  settlePeripheryParams.tickLower = tickLower;
  settlePeripheryParams.tickUpper = tickUpper;

  return settlePeripheryParams;
};
