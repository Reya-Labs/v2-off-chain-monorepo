import { Event } from 'ethers';

import { RateOracleConfiguredEvent } from '@voltz-protocol/commons-v2';
import { parseBaseEvent } from '../utils/baseEvent';
import { convertLowercaseString } from '@voltz-protocol/commons-v2';

export const parseRateOracleConfigured = (
  chainId: number,
  event: Event,
): RateOracleConfiguredEvent => {
  // 1. Type of event
  const type = 'rate-oracle-configured';

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
