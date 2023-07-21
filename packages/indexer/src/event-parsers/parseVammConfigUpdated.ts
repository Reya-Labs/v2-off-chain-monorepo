import { Event, BigNumber } from 'ethers';

import {
  ProtocolEventType,
  VammConfigUpdatedEvent,
} from '@voltz-protocol/bigquery-v2';
import { parseBaseEvent } from './utils/parseBaseEvent';
import {
  VAMM_MAX_TICK,
  VAMM_MIN_TICK,
  convertToAddress,
  descale,
} from '@voltz-protocol/commons-v2';

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
    event.args?.config.priceImpactPhi as BigNumber,
  );

  const priceImpactBeta = wadDescaler(
    event.args?.config.priceImpactBeta as BigNumber,
  );

  const spread = wadDescaler(event.args?.config.spread as BigNumber);

  const rateOracle = event.args?.config.rateOracle as string;

  const minTick = (event.args?.config.minTick || VAMM_MIN_TICK) as number;

  const maxTick = (event.args?.config.maxTick || VAMM_MAX_TICK) as number;

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
