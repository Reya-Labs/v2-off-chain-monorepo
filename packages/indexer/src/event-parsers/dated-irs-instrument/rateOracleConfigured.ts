import { Event } from 'ethers';

import { ProtocolEventType, RateOracleConfiguredEvent } from '../types';
import { parseBaseEvent } from '../utils/baseEvent';
import { convertLowercaseString } from '../utils/convertLowercase';

export const parseRateOracleConfigured = (
  chainId: number,
  event: Event,
): RateOracleConfiguredEvent => {
  // 1. Type of event
  const type: ProtocolEventType = 'rate-oracle-configured';

  // 2. Parse particular args
  const marketId = event.args?.marketId as string;
  const oracleAddress = event.args?.oracleAddress as string;

  // 3. Parse base event
  const baseEvent = parseBaseEvent(chainId, event, type);

  // 4. Return particular event
  return {
    ...baseEvent,

    marketId,
    oracleAddress: convertLowercaseString(oracleAddress),
  };
};
