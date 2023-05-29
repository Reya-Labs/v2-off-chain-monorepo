import { RolloverAndSwapArgs, RolloverAndSwapPeripheryParams, SwapPeripheryParams } from "../types/actionArgTypes";
import { BigNumberish } from 'ethers';
import {getDefaultSqrtPriceLimit} from "../swap/getDefaultSqrtPriceLimits";
import { getSqrtPriceLimitFromFixedRateLimit } from '../swap/getSqrtPriceLimitFromFixedRate';
import { getClosestTickAndFixedRate } from '../swap/getClosestTickAndFixedRate';
import { scale } from '../../common/math/scale';
import { getSwapPeripheryParams } from "../swap/getSwapPeripheryParams";

export type GetRolloverAndSwapPeripheryParamsArgs = {
  margin: number;
  isFT: boolean;
  notional: number;
  fixedLow: number;
  fixedHigh: number;
  marginEngineAddress: string;
  underlyingTokenDecimals: number;
  fixedRateLimit?: number | null;
  tickSpacing: number;
  maturedMarginEngineAddress: string;
  maturedPositionOwnerAddress: string;
  maturedPositionSettlementBalance: number;
  maturedPositionTickLower: number;
  maturedPositionTickUpper: number;
};

export const getRolloverAndSwapPeripheryParams = ({
   margin,
   isFT,
   notional,
   fixedLow,
   fixedHigh,
   marginEngineAddress,
   underlyingTokenDecimals,
   fixedRateLimit,
   tickSpacing,
   maturedMarginEngineAddress,
  maturedPositionOwnerAddress,
 maturedPositionSettlementBalance,
  maturedPositionTickLower,
  maturedPositionTickUpper,
   }: GetRolloverAndSwapPeripheryParamsArgs): RolloverAndSwapPeripheryParams => {

  const newSwapPeripheryParams: SwapPeripheryParams = getSwapPeripheryParams(
    {
      margin,
      isFT,
      notional,
      fixedLow,
      fixedHigh,
      marginEngineAddress,
      underlyingTokenDecimals,
      fixedRateLimit,
      tickSpacing
    }
  );

  const rolloverAndSwapPeripheryParams: RolloverAndSwapPeripheryParams = {
    maturedMarginEngineAddress: marginEngineAddress,
    maturedPositionOwnerAddress: marginEngineAddress,
    maturedPositionTickLower: maturedPositionTickLower,
    maturedPositionTickUpper: maturedPositionTickUpper,
    newSwapPeripheryParams: newSwapPeripheryParams
  };

  return rolloverAndSwapPeripheryParams;
};
