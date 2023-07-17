import { Event, BigNumber } from 'ethers';

import {
  ProtocolEventType,
  VammConfigUpdatedEvent,
} from '@voltz-protocol/bigquery-v2';
import { parseBaseEvent } from './utils/parseBaseEvent';
import { convertToAddress, descale } from '@voltz-protocol/commons-v2';

export const parseVammConfigUpdated = (
  chainId: number,
  event: Event,
): VammConfigUpdatedEvent => {
  const wadDescaler = descale(18);

  // 1. Type of event
  const type = ProtocolEventType.VammConfigUpdated;

  // 2. Parse particular args
  const marketId = (event.args?.marketId as BigNumber).toString();

  const maturityTimestamp = event.args?.maturityTimestamp as number;

  const priceImpactPhi = wadDescaler(
    event.args?.mutableConfig.priceImpactPhi as BigNumber,
  );

  const priceImpactBeta = wadDescaler(
    event.args?.mutableConfig.priceImpactBeta as BigNumber,
  );

  const spread = wadDescaler(event.args?.mutableConfig.spread as BigNumber);

  const rateOracle = event.args?.mutableConfig.rateOracle as string;

  const minTick = event.args?.mutableConfig.minTick as number;

  const maxTick = event.args?.mutableConfig.maxTick as number;

  // 3. Parse base event
  const baseEvent = parseBaseEvent(chainId, event, type);

  // 4. Return particular event
  return {
    ...baseEvent,

    marketId,
    maturityTimestamp,
    priceImpactPhi,
    priceImpactBeta,
    spread,
    rateOracle: convertToAddress(rateOracle),
    minTick,
    maxTick,
  };
};
