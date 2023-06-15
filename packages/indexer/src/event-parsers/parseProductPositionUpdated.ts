import { BigNumber, Event } from 'ethers';

import {
  ProductPositionUpdatedEvent,
  ProtocolEventType,
} from '@voltz-protocol/bigquery-v2';
import { parseBaseEvent } from './utils/parseBaseEvent';
import {
  getMarketQuoteToken,
  getTokenDetails,
} from '@voltz-protocol/commons-v2';

export const parseProductPositionUpdated = (
  chainId: number,
  event: Event,
): ProductPositionUpdatedEvent => {
  // 1. Type of event
  const type = ProtocolEventType.product_position_updated;

  // 2. Parse particular args
  const accountId = (event.args?.accountId as BigNumber).toString();
  const marketId = (event.args?.marketId as BigNumber).toString();
  const maturityTimestamp = event.args?.maturityTimestamp as number;

  const quoteToken = getMarketQuoteToken(chainId, marketId);
  const { tokenDescaler } = getTokenDetails(quoteToken);

  const baseDelta = tokenDescaler(event.args?.baseDelta as BigNumber);
  const quoteDelta = tokenDescaler(event.args?.quoteDelta as BigNumber);

  // 3. Parse base event
  const baseEvent = parseBaseEvent(chainId, event, type);

  // 4. Return particular event
  return {
    ...baseEvent,

    accountId,
    marketId,
    maturityTimestamp,
    baseDelta,
    quoteDelta,
  };
};
