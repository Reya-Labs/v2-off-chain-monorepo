import { Event, BigNumber } from 'ethers';

import { getTokenDetails } from '@voltz-protocol/commons-v2';
import { parseBaseEvent } from '../utils/baseEvent';
import {
  convertLowercaseString,
  CollateralUpdateEvent,
  ProtocolEventType,
} from '@voltz-protocol/commons-v2';

export const parseCollateralUpdate = (
  chainId: number,
  event: Event,
): CollateralUpdateEvent => {
  // 1. Type of event
  const type: ProtocolEventType = 'collateral-update';

  // 2. Parse particular args
  const accountId = (event.args?.accountId as BigNumber).toString();
  const collateralType = event.args?.collateralType as string;
  const { tokenDescaler } = getTokenDetails(collateralType);
  const collateralAmount = tokenDescaler(event.args?.tokenAmount as BigNumber);

  // 3. Parse base event
  const baseEvent = parseBaseEvent(chainId, event, type);

  // 4. Return particular event
  return {
    ...baseEvent,

    accountId,
    collateralType: convertLowercaseString(collateralType),
    collateralAmount,
    liquidatorBoosterAmount: 0,
  };
};
