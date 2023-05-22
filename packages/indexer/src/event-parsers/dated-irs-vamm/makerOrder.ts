import { Event, BigNumber } from 'ethers';

import { EventType, MakerOrderEvent } from '../types';
import { getTokenDetails } from '../../utils/token';
import { getMarketQuoteToken } from '../../utils/markets/getMarketQuoteToken';
import { parseBaseEvent } from '../utils/baseEvent';
import { convertLowercaseString } from '../utils/convertLowercase';

export const parseMakerOrder = (
  chainId: number,
  event: Event,
): MakerOrderEvent => {
  // 1. Type of event
  const type: EventType = 'maker-order';

  // 2. Parse particular args
  const accountId = (event.args?.accountId as BigNumber).toString();
  const marketId = (event.args?.marketId as BigNumber).toString();
  const maturityTimestamp = event.args?.maturityTimestamp as number;

  const quoteToken = getMarketQuoteToken(marketId);
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