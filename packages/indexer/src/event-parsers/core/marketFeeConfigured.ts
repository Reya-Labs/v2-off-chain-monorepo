import { Event, BigNumber } from 'ethers';

import { ProtocolEventType, MarketFeeConfiguredEvent } from '../types';
import { parseBaseEvent } from '../utils/baseEvent';
import { descale } from '../../utils/token';

export const parseMarketFeeConfigured = (
  chainId: number,
  event: Event,
): MarketFeeConfiguredEvent => {
  // 1. Type of event
  const type: ProtocolEventType = 'market-fee-configured';

  // 2. Parse particular args
  const productId = event.args?.productId as string;
  const marketId = event.args?.marketId as string;
  const feeCollectorAccountId = event.args?.feeCollectorAccountId as string;

  const atomicMakerFee = descale(18)(event.args?.atomicMakerFee as BigNumber);
  const atomicTakerFee = descale(18)(event.args?.atomicTakerFee as BigNumber);

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
