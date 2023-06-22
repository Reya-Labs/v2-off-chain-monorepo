import {
  RolloverWithSwapArgs,
  RolloverWithSwapPeripheryParams,
  SwapPeripheryParams,
} from '../types/actionArgTypes';
import { BigNumberish } from 'ethers';
import { getDefaultSqrtPriceLimit } from '../../common/math/getDefaultSqrtPriceLimits';
import { getSqrtPriceLimitFromFixedRateLimit } from '../../common/math/getSqrtPriceLimitFromFixedRate';
import { getClosestTickAndFixedRate } from '../../common/math/getClosestTickAndFixedRate';
import { scale } from '../../common/math/scale';
import { getSwapPeripheryParams } from '../swap/getSwapPeripheryParams';
import { PositionInfo } from '../../common/api/position/types';

export type GetRolloverAndSwapPeripheryParamsArgs = {
  margin: number;
  isFT: boolean;
  notional: number;
  marginEngineAddress: string;
  underlyingTokenDecimals: number;
  fixedRateLimit?: number | null;
  tickSpacing: number;
  maturedPosition: PositionInfo;
};

export const getRolloverWithSwapPeripheryParams = ({
  margin,
  isFT,
  notional,
  marginEngineAddress,
  underlyingTokenDecimals,
  fixedRateLimit,
  tickSpacing,
  maturedPosition,
}: GetRolloverAndSwapPeripheryParamsArgs): RolloverWithSwapPeripheryParams => {
  const newSwapPeripheryParams: SwapPeripheryParams = getSwapPeripheryParams({
    margin,
    isFT,
    notional,
    marginEngineAddress,
    underlyingTokenDecimals,
    fixedRateLimit,
    tickSpacing,
  });

  const rolloverAndSwapPeripheryParams: RolloverWithSwapPeripheryParams = {
    maturedMarginEngineAddress: maturedPosition.ammMarginEngineAddress,
    maturedPositionOwnerAddress: maturedPosition.positionOwnerAddress,
    maturedPositionTickLower: maturedPosition.positionTickLower,
    maturedPositionTickUpper: maturedPosition.positionTickUpper,
    newSwapPeripheryParams: newSwapPeripheryParams,
  };

  return rolloverAndSwapPeripheryParams;
};
