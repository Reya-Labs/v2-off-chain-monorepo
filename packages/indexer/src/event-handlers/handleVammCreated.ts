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
    const updateBatch = insertVammCreatedEvent(environmentTag, event);
    await sendUpdateBatches([updateBatch]);
  }

  {
    const updateBatch = insertVammPriceChangeEvent(environmentTag, event);
    await sendUpdateBatches([updateBatch]);
  }
};
