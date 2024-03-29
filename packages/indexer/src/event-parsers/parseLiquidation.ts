import { Event, BigNumber } from 'ethers';

import { parseBaseEvent } from './utils/parseBaseEvent';
import {
  LiquidationEvent,
  ProtocolEventType,
} from '@voltz-protocol/bigquery-v2';
import { getTokenDetails, convertToAddress } from '@voltz-protocol/commons-v2';

export const parseLiquidation = (
  chainId: number,
  event: Event,
): LiquidationEvent => {
  // 1. Type of event
  const type = ProtocolEventType.Liquidation;

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

  const highestUnrealizedLossPreClose = tokenDescaler(
    (event.args?.highestUnrealizedLossPreClose ||
      BigNumber.from(0)) as BigNumber,
  );
  const highestUnrealizedLossPostClose = tokenDescaler(
    (event.args?.highestUnrealizedLossPostClose ||
      BigNumber.from(0)) as BigNumber,
  );

  // 3. Parse base event
  const baseEvent = parseBaseEvent(chainId, event, type);

  // 4. Return particular event
  return {
    ...baseEvent,

    liquidatedAccountId,
    collateralType: convertToAddress(collateralType),
    sender: convertToAddress(sender),
    liquidatorAccountId,

    liquidatorRewardAmount,
    imPreClose,
    imPostClose,

    highestUnrealizedLossPreClose,
    highestUnrealizedLossPostClose,
  };
};
