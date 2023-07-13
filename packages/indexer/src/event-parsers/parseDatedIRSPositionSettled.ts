import { BigNumber, Event } from 'ethers';

import { parseBaseEvent } from './utils/parseBaseEvent';
import {
  DatedIRSPositionSettledEvent,
  ProtocolEventType,
} from '@voltz-protocol/bigquery-v2';
import { convertToAddress, getTokenDetails } from '@voltz-protocol/commons-v2';

export const parseDatedIRSPositionSettled = (
  chainId: number,
  event: Event,
): DatedIRSPositionSettledEvent => {
  // 1. Type of event
  const type = ProtocolEventType.DatedIRSPositionSettled;

  // 2. Parse particular args
  const accountId = event.args?.accountId as string;
  const productId = event.args?.productId as string;
  const marketId = event.args?.marketId as string;
  const maturityTimestamp = event.args?.maturityTimestamp as number;
  const collateralType = event.args?.collateralType as string;

  const { tokenDescaler } = getTokenDetails(collateralType);

  const settlementCashflowInQuote = tokenDescaler(
    event.args?.settlementCashflowInQuote as BigNumber,
  );

  // 3. Parse base event
  const baseEvent = parseBaseEvent(chainId, event, type);

  // 4. Return particular event
  return {
    ...baseEvent,

    accountId,
    productId,
    marketId,
    maturityTimestamp,
    collateralType: convertToAddress(collateralType),
    settlementCashflowInQuote,
  };
};
