import { Event, BigNumber } from 'ethers';

import { parseBaseEvent } from './utils/parseBaseEvent';
import {
  MakerOrderEvent,
  ProtocolEventType,
  getMarketQuoteToken,
} from '@voltz-protocol/bigquery-v2';
import {
  getTokenDetails,
  convertLowercaseString,
} from '@voltz-protocol/commons-v2';

export const parseMakerOrder = (
  chainId: number,
  event: Event,
): MakerOrderEvent => {
  // 1. Type of event
  const type = ProtocolEventType.maker_order;

  // 2. Parse particular args
  const accountId = (event.args?.accountId as BigNumber).toString();
  const marketId = (event.args?.marketId as BigNumber).toString();
  const maturityTimestamp = event.args?.maturityTimestamp as number;

  const quoteToken = getMarketQuoteToken(chainId, marketId);
  const { tokenDescaler } = getTokenDetails(quoteToken);

  const tickLower = event.args?.tickLower as number;
  const tickUpper = event.args?.tickLower as number;

  const executedBaseAmount = tokenDescaler(
    event.args?.executedBaseAmount as BigNumber,
  );

  // 3. Parse base event
  const baseEvent = parseBaseEvent(chainId, event, type);

  // 4. Return particular event
  return {
    ...baseEvent,

    accountId: accountId,
    marketId: marketId,
    maturityTimestamp,
    quoteToken: convertLowercaseString(quoteToken),

    tickLower,
    tickUpper,
    executedBaseAmount,
  };
};
