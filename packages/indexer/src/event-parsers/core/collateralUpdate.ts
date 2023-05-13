import { Event, BigNumber } from 'ethers';

import { CollateralUpdateEvent, EventType } from '../types';
import { getTokenDetails } from '../../utils/token';
import { parseBaseEvent } from '../utils/baseEvent';
import { convertLowercaseString } from '../utils/convertLowercase';

export const parseCollateralUpdate = (
  chainId: number,
  event: Event,
): CollateralUpdateEvent => {
  // 1. Type of event
  const type: EventType = 'collateral-update';

  // 2. Parse particular args
  const accountId = (event.args?.accountId as BigNumber).toString();
  const collateralType = event.args?.collateralType as string;
  const { tokenDescaler } = getTokenDetails(collateralType);
  const tokenAmount = tokenDescaler(event.args?.tokenAmount as BigNumber);

  // 3. Parse base event
  const baseEvent = parseBaseEvent(chainId, event, type);

  // 4. Return particular event
  return {
    ...baseEvent,

    accountId,
    collateralType: convertLowercaseString(collateralType),
    tokenAmount,
  };
};
