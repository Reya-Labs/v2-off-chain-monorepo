import { Event, BigNumber } from 'ethers';

import {
  ProtocolEventType,
  VammCreatedEvent,
} from '@voltz-protocol/bigquery-v2';
import { parseBaseEvent } from './utils/parseBaseEvent';
import {
  VAMM_MAX_TICK,
  VAMM_MIN_TICK,
  convertToAddress,
  descale,
} from '@voltz-protocol/commons-v2';

export const parseVammCreated = (
  chainId: number,
  event: Event,
): VammCreatedEvent => {
  const wadDescaler = descale(18);

  // 1. Type of event
  const type = ProtocolEventType.VammCreated;

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

  const minTick = (event.args?.mutableConfig.minTick ||
    VAMM_MIN_TICK) as number;
  const maxTick = (event.args?.mutableConfig.maxTick ||
    VAMM_MAX_TICK) as number;

  const rateOracle = event.args?.mutableConfig.rateOracle as string;

  const maxLiquidityPerTick = (
    event.args?.config._maxLiquidityPerTick as BigNumber
  ).toString();

  const tickSpacing = event.args?.config._tickSpacing as number;

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
    rateOracle: convertToAddress(rateOracle),
    maxLiquidityPerTick,
    tickSpacing,
    maturityTimestamp,

    minTick,
    maxTick,
  };
};
