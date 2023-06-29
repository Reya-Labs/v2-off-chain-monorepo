import {
  VammCreatedEvent,
  pullVammCreatedEvent,
  insertVammCreatedEvent,
  insertVammPriceChangeEvent,
  sendUpdateBatches,
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
    const updateBatch2 = insertVammPriceChangeEvent(environmentTag, event);
    await sendUpdateBatches([updateBatch1, updateBatch2]);
  }
};
