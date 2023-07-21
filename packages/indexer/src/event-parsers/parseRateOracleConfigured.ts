import { BigNumber, Event } from 'ethers';

import { parseBaseEvent } from './utils/parseBaseEvent';
import {
  RateOracleConfiguredEvent,
  ProtocolEventType,
} from '@voltz-protocol/bigquery-v2';
import { convertToAddress } from '@voltz-protocol/commons-v2';

export const parseRateOracleConfigured = (
  chainId: number,
  event: Event,
): RateOracleConfiguredEvent => {
  // 1. Type of event
  const type = ProtocolEventType.RateOracleConfigured;

  // 2. Parse particular args
  const marketId = (event.args?.marketId as BigNumber).toString();
  const oracleAddress = event.args?.oracleAddress as string;

  const maturityIndexCachingWindowInSeconds = (
    (event.args?.maturityIndexCachingWindowInSeconds ||
      BigNumber.from(0)) as BigNumber
  ).toNumber();

  // 3. Parse base event
  const baseEvent = parseBaseEvent(chainId, event, type);

  // 4. Return particular event
  return {
    ...baseEvent,

    marketId,
    oracleAddress: convertToAddress(oracleAddress),
    maturityIndexCachingWindowInSeconds,
  };
};
