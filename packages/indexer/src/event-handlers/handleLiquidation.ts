import {
  LiquidationEvent,
  insertLiquidationEvent,
  pullLiquidationEvent,
  sendUpdateBatches,
} from '@voltz-protocol/bigquery-v2';
import { getEnvironmentV2 } from '../services/envVars';

export const handleLiquidation = async (event: LiquidationEvent) => {
  const environmentTag = getEnvironmentV2();
  const existingEvent = await pullLiquidationEvent(environmentTag, event.id);

  if (existingEvent) {
    return;
  }

  const updateBatch = insertLiquidationEvent(environmentTag, event);
  await sendUpdateBatches([updateBatch]);
};
