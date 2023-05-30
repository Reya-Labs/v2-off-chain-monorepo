import { Event, BigNumber } from 'ethers';

import { ProtocolEventType, LiquidationEvent } from '../types';
import { getTokenDetails } from '../../utils/token';
import { parseBaseEvent } from '../utils/baseEvent';
import { convertLowercaseString } from '../utils/convertLowercase';

export const parseLiquidation = (
  chainId: number,
  event: Event,
): LiquidationEvent => {
  // 1. Type of event
  const type: ProtocolEventType = 'liquidation';

  // 2. Parse particular args
  const liquidatedAccountId = (
    event.args?.liquidatedAccountId as BigNumber
  ).toString();
  const collateralType = event.args?.collateralType as string;
  const sender = event.args?.sender as string;
  const liquidatorAccountId = (
    event.args?.liquidatorAccountId as BigNumber
  ).toString();
  const { tokenDescaler } = getTokenDetails(collateralType);

  const liquidatorRewardAmount = tokenDescaler(
    event.args?.liquidatorRewardAmount as BigNumber,
  );
  const imPreClose = tokenDescaler(event.args?.imPreClose as BigNumber);
  const imPostClose = tokenDescaler(event.args?.imPostClose as BigNumber);

  // 3. Parse base event
  const baseEvent = parseBaseEvent(chainId, event, type);

  // 4. Return particular event
  return {
    ...baseEvent,

    liquidatedAccountId,
    collateralType: convertLowercaseString(collateralType),
    sender: convertLowercaseString(sender),
    liquidatorAccountId,

    liquidatorRewardAmount,
    imPreClose,
    imPostClose,
  };
};
