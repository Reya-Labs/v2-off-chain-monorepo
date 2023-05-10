import { Event, BigNumber } from 'ethers';

import {
  CollateralDepositedEvent,
  CollateralUpdateEvent,
  LiquidatorBoosterUpdateEvent,
} from '../types';
import { getTokenDetails } from '../../utils/token';
import { parseBaseEvent } from '../utils/baseEvent';
import { convertLowercaseString } from '../utils/convertLowercase';

const parseCollateral = (
  chainId: number,
  event: Event,
  type:
    | 'collateral-deposited'
    | 'collateral-withdrawn'
    | 'collateral-update'
    | 'liquidator-booster-update',
): CollateralDepositedEvent => {
  // 1. Parse particular args
  const accountId = (event.args?.accountId as BigNumber).toString();
  const collateralType = event.args?.collateralType as string;
  const { tokenDescaler } = getTokenDetails(collateralType);
  const tokenAmount = tokenDescaler(event.args?.tokenAmount as BigNumber);

  // 2. Parse base event
  const baseEvent = parseBaseEvent(chainId, event, type);

  // 3. Return particular event
  return {
    ...baseEvent,

    accountId,
    collateralType: convertLowercaseString(collateralType),
    tokenAmount,
  };
};

export const parseCollateralDeposited = (
  chainId: number,
  event: Event,
): CollateralUpdateEvent => {
  const type = 'collateral-deposited';
  return parseCollateral(chainId, event, type);
};

export const parseCollateralUpdate = (
  chainId: number,
  event: Event,
): CollateralUpdateEvent => {
  const type = 'collateral-update';
  return parseCollateral(chainId, event, type);
};

export const parseCollateralWithdrawn = (
  chainId: number,
  event: Event,
): CollateralUpdateEvent => {
  const type = 'collateral-withdrawn';
  return parseCollateral(chainId, event, type);
};

export const parseLiquidatorBoosterUpdate = (
  chainId: number,
  event: Event,
): LiquidatorBoosterUpdateEvent => {
  const type = 'liquidator-booster-update';
  return parseCollateral(chainId, event, type);
};
