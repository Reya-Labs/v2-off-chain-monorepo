import { Event } from 'ethers';

import {
  ProtocolEventType,
  MarketConfiguredEvent,
} from '@voltz-protocol/commons-v2';
import { parseBaseEvent } from '../utils/baseEvent';
import { convertLowercaseString } from '@voltz-protocol/commons-v2';

export const parseMarketConfigured = (
  chainId: number,
  event: Event,
): MarketConfiguredEvent => {
  // 1. Type of event
  const type: ProtocolEventType = 'market-configured';

  // 2. Parse particular args
  const marketId = event.args?.config.marketId as string;
  const quoteToken = event.args?.config.quoteToken as string;

  // 3. Parse base event
  const baseEvent = parseBaseEvent(chainId, event, type);

  // 4. Return particular event
  return {
    ...baseEvent,

    marketId,
    quoteToken: convertLowercaseString(quoteToken),
  };
};
