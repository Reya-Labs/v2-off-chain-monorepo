import { Event, BigNumber } from 'ethers';

import {
  getTokenDetails,
  convertLowercaseString,
} from '@voltz-protocol/commons-v2';
import { parseBaseEvent } from './utils/parseBaseEvent';
import {
  CollateralUpdateEvent,
  ProtocolEventType,
} from '@voltz-protocol/bigquery-v2';

export const parseCollateralUpdate = (
  chainId: number,
  event: Event,
): CollateralUpdateEvent => {
  // 1. Type of event
  const type = ProtocolEventType.collateral_update;

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
