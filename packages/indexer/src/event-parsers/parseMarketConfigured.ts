import { Event } from 'ethers';

import {
  MarketConfiguredEvent,
  ProtocolEventType,
} from '@voltz-protocol/bigquery-v2';
import { parseBaseEvent } from './utils/parseBaseEvent';
import { convertToAddress } from '@voltz-protocol/commons-v2';

export const parseMarketConfigured = (
  chainId: number,
  event: Event,
): MarketConfiguredEvent => {
  // 1. Type of event
  const type = ProtocolEventType.MarketConfigured;

  // 2. Parse particular args
  const marketId = event.args?.config.marketId as string;
  const quoteToken = event.args?.config.quoteToken as string;

  // 3. Parse base event
  const baseEvent = parseBaseEvent(chainId, event, type);

  // 4. Return particular event
  return {
    ...baseEvent,

    marketId,
    quoteToken: convertToAddress(quoteToken),
  };
};
