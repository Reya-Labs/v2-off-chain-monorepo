import {
  TakerOrderEvent,
  insertTakerOrderEvent,
  pullTakerOrderEvent,
  sendUpdateBatches,
} from '@voltz-protocol/bigquery-v2';
import { getEnvironmentV2 } from '../services/envVars';

export const handleTakerOrder = async (event: TakerOrderEvent) => {
  const environmentTag = getEnvironmentV2();
  const existingEvent = await pullTakerOrderEvent(environmentTag, event.id);

  if (existingEvent) {
    return;
  }

  const updateBatch = insertTakerOrderEvent(environmentTag, event);
  await sendUpdateBatches([updateBatch]);
};
