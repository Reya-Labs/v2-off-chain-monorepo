import { Event, BigNumber } from 'ethers';

import { parseBaseEvent } from './utils/parseBaseEvent';
import {
  LiquidityChangeEvent,
  ProtocolEventType,
  getMarketQuoteToken,
} from '@voltz-protocol/bigquery-v2';
import {
  getTokenDetails,
  convertLowercaseString,
} from '@voltz-protocol/commons-v2';

export const parseLiquidityChange = (
  chainId: number,
  event: Event,
): LiquidityChangeEvent => {
  // 1. Type of event
  const type = ProtocolEventType.liquidity_change;

  // 2. Parse particular args
  const accountId = (event.args?.accountId as BigNumber).toString();
  const marketId = (event.args?.marketId as BigNumber).toString();
  const maturityTimestamp = event.args?.maturityTimestamp as number;

  const quoteToken = getMarketQuoteToken(marketId);
  const { tokenDescaler } = getTokenDetails(quoteToken);

  const tickLower = event.args?.tickLower as number;
  const tickUpper = event.args?.tickUpper as number;

  const liquidityDelta = tokenDescaler(event.args?.liquidityDelta as BigNumber);

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
    liquidityDelta,
  };
};
