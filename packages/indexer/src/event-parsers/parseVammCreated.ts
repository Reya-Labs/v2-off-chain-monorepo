import { Event, BigNumber } from 'ethers';

import {
  ProtocolEventType,
  VammCreatedEvent,
  descale,
} from '@voltz-protocol/commons-v2';
import { parseBaseEvent } from './utils/parseBaseEvent';
import { convertLowercaseString } from '@voltz-protocol/commons-v2';

export const parseVammCreated = (
  chainId: number,
  event: Event,
): VammCreatedEvent => {
  const wadDescaler = descale(18);

  // 1. Type of event
  const type = ProtocolEventType.vamm_created;

  // 2. Parse particular args
  const marketId = (event.args?.marketId as BigNumber).toString();

  const tick = Number(event.args?.tick);

  const priceImpactPhi = wadDescaler(
    event.args?.mutableConfig.priceImpactPhi as BigNumber,
  );

  const priceImpactBeta = wadDescaler(
    event.args?.mutableConfig.priceImpactBeta as BigNumber,
  );

  const spread = wadDescaler(event.args?.mutableConfig.spread as BigNumber);

  const rateOracle = event.args?.mutableConfig.rateOracle as string;

  const maxLiquidityPerTick = (
    event.args?.config.maxLiquidityPerTick as BigNumber
  ).toString();

  const tickSpacing = event.args?.config.tickSpacing as number;

  const maturityTimestamp = event.args?.config.maturityTimestamp as number;

  // 3. Parse base event
  const baseEvent = parseBaseEvent(chainId, event, type);

  // 4. Return particular event
  return {
    ...baseEvent,

    marketId,
    tick,
    priceImpactPhi,
    priceImpactBeta,
    spread,
    rateOracle: convertLowercaseString(rateOracle),
    maxLiquidityPerTick,
    tickSpacing,
    maturityTimestamp,
  };
};
