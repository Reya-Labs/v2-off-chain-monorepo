import { Event, BigNumber, ethers } from 'ethers';

import { ProtocolEventType, VammCreatedEvent } from '../types';
import { parseBaseEvent } from '../utils/baseEvent';
import { convertLowercaseString } from '../utils/convertLowercase';

export const parseVammCreated = (
  chainId: number,
  event: Event,
): VammCreatedEvent => {
  // 1. Type of event
  const type: ProtocolEventType = 'vamm-created';

  // 2. Parse particular args
  const marketId = (event.args?._marketId as BigNumber).toString();
  const priceImpactPhi = Number(
    ethers.utils.formatUnits(
      event.args?._mutableConfig.priceImpactPhi.toString(),
      18,
    ),
  );
  const priceImpactBeta = Number(
    ethers.utils.formatUnits(
      event.args?._mutableConfig.priceImpactBeta.toString(),
      18,
    ),
  );
  const spread = Number(
    ethers.utils.formatUnits(event.args?._mutableConfig.spread.toString(), 18),
  );
  const rateOracle = event.args?._mutableConfig.rateOracle as string;

  const maxLiquidityPerTick = (
    event.args?._config._maxLiquidityPerTick as BigNumber
  ).toString();
  const tickSpacing = event.args?._config._tickSpacing as number;
  const maturityTimestamp = event.args?._config.maturityTimestamp as number;

  // 3. Parse base event
  const baseEvent = parseBaseEvent(chainId, event, type);

  // 4. Return particular event
  return {
    ...baseEvent,

    marketId,
    priceImpactPhi,
    priceImpactBeta,
    spread,
    rateOracle: convertLowercaseString(rateOracle),
    maxLiquidityPerTick,
    tickSpacing,
    maturityTimestamp,
  };
};
