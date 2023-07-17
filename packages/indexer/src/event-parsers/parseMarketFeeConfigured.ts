import { Event, BigNumber } from 'ethers';

import { parseBaseEvent } from './utils/parseBaseEvent';
import {
  MarketFeeConfiguredEvent,
  ProtocolEventType,
} from '@voltz-protocol/bigquery-v2';
import { descale } from '@voltz-protocol/commons-v2';

export const parseMarketFeeConfigured = (
  chainId: number,
  event: Event,
): MarketFeeConfiguredEvent => {
  // 1. Type of event
  const type = ProtocolEventType.MarketFeeConfigured;

  // 2. Parse particular args
  const productId = (event.args?.config.productId as BigNumber).toString();
  const marketId = (event.args?.config.marketId as BigNumber).toString();
  const feeCollectorAccountId = (
    event.args?.config.feeCollectorAccountId as BigNumber
  ).toString();

  const atomicMakerFee = descale(18)(
    event.args?.config.atomicMakerFee as BigNumber,
  );
  const atomicTakerFee = descale(18)(
    event.args?.config.atomicTakerFee as BigNumber,
  );

  // 3. Parse base event
  const baseEvent = parseBaseEvent(chainId, event, type);

  // 4. Return particular event
  return {
    ...baseEvent,

    productId,
    marketId,
    feeCollectorAccountId,
    atomicMakerFee,
    atomicTakerFee,
  };
};
