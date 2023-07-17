import { BigNumber, Event } from 'ethers';

import { parseBaseEvent } from './utils/parseBaseEvent';
import {
  ProtocolEventType,
  TakerOrderEvent,
} from '@voltz-protocol/bigquery-v2';
import { convertToAddress, getTokenDetails } from '@voltz-protocol/commons-v2';

export const parseTakerOrder = (
  chainId: number,
  event: Event,
): TakerOrderEvent => {
  // 1. Type of event
  const type = ProtocolEventType.TakerOrder;

  // 2. Parse particular args
  const accountId = (event.args?.accountId as BigNumber).toString();
  const marketId = (event.args?.marketId as BigNumber).toString();
  const maturityTimestamp = event.args?.maturityTimestamp as number;
  const collateralType = event.args?.collateralType as string;

  const { tokenDescaler } = getTokenDetails(collateralType);

  const executedBaseAmount = tokenDescaler(
    event.args?.executedBaseAmount as BigNumber,
  );
  const executedQuoteAmount = tokenDescaler(
    event.args?.executedQuoteAmount as BigNumber,
  );
  const annualizedNotionalAmount = tokenDescaler(
    event.args?.annualizedNotionalAmount as BigNumber,
  );

  // 3. Parse base event
  const baseEvent = parseBaseEvent(chainId, event, type);

  // 4. Return particular event
  return {
    ...baseEvent,

    accountId,
    marketId,
    maturityTimestamp,
    quoteToken: convertToAddress(collateralType),
    executedBaseAmount,
    executedQuoteAmount,
    annualizedNotionalAmount,
  };
};
