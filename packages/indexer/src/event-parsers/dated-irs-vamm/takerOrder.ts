import { Event, BigNumber } from 'ethers';

import { EventType, TakerOrderEvent } from '../types';
import { getTokenDetails } from '../../utils/token';
import { getMarketQuoteToken } from '../../utils/markets/getMarketQuoteToken';
import { parseBaseEvent } from '../utils/baseEvent';
import { convertLowercaseString } from '../utils/convertLowercase';

export const parseTakerOrder = (
  chainId: number,
  event: Event,
): TakerOrderEvent => {
  // 1. Type of event
  const type: EventType = 'taker-order';

  // 2. Parse particular args
  const accountId = (event.args?.accountId as BigNumber).toString();
  const marketId = (event.args?.marketId as BigNumber).toString();
  const maturityTimestamp = event.args?.maturityTimestamp as number;

  const quoteToken = getMarketQuoteToken(marketId);
  const { tokenDescaler } = getTokenDetails(quoteToken);

  const executedBaseAmount = tokenDescaler(
    event.args?.executedBaseAmount as BigNumber,
  );
  const executedQuoteAmount = tokenDescaler(
    event.args?.executedQuoteAmount as BigNumber,
  );
  const annualizedBaseAmount = tokenDescaler(
    event.args?.annualizedBaseAmount as BigNumber,
  );

  // 3. Parse base event
  const baseEvent = parseBaseEvent(chainId, event, type);

  // 4. Return particular event
  return {
    ...baseEvent,

    accountId,
    marketId,
    maturityTimestamp,
    quoteToken: convertLowercaseString(quoteToken),

    executedBaseAmount,
    executedQuoteAmount,
    annualizedBaseAmount,
  };
};
