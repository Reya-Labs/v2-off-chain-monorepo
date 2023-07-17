import {
  VammCreatedEvent,
  pullVammCreatedEvent,
  insertVammCreatedEvent,
  insertVammPriceChangeEvent,
  sendUpdateBatches,
  insertIrsVammPoolEntry,
} from '@voltz-protocol/bigquery-v2';
import { getEnvironmentV2 } from '../services/envVars';

export const handleVammCreated = async (event: VammCreatedEvent) => {
  const environmentTag = getEnvironmentV2();
  const existingEvent = await pullVammCreatedEvent(environmentTag, event.id);

  if (existingEvent) {
    return;
  }

  {
    const updateBatch1 = insertVammCreatedEvent(environmentTag, event);

    const irsVammPoolEntry = {
      ...event,
      currentTick: event.tick,
      creationTimestamp: event.blockTimestamp,
    };

    const updateBatch2 = insertIrsVammPoolEntry(
      environmentTag,
      irsVammPoolEntry,
    );

    const updateBatch3 = insertVammPriceChangeEvent(environmentTag, event);

    await sendUpdateBatches([updateBatch1, updateBatch2, updateBatch3]);
  }
};
