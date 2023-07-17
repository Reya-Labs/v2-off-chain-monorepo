import {
  sendUpdateBatches,
  VammConfigUpdatedEvent,
  pullVammConfigUpdatedEvent,
  insertVammConfigUpdatedEvent,
  updateIrsVammPoolEntry,
} from '@voltz-protocol/bigquery-v2';
import { getEnvironmentV2 } from '../services/envVars';
import { encodeV2PoolId } from '@voltz-protocol/commons-v2/dist/types';

export const handleVammConfigUpdated = async (
  event: VammConfigUpdatedEvent,
) => {
  const environmentTag = getEnvironmentV2();
  const existingEvent = await pullVammConfigUpdatedEvent(
    environmentTag,
    event.id,
  );

  if (existingEvent) {
    return;
  }

  {
    const updateBatch1 = insertVammConfigUpdatedEvent(environmentTag, event);

    const poolId = encodeV2PoolId(event);

    const updateBatch2 = updateIrsVammPoolEntry(environmentTag, poolId, {
      priceImpactPhi: event.priceImpactPhi,
      priceImpactBeta: event.priceImpactBeta,
      spread: event.spread,
      rateOracle: event.rateOracle,
      minTick: event.minTick,
      maxTick: event.maxTick,
    });

    await sendUpdateBatches([updateBatch1, updateBatch2]);
  }
};
