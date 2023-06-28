import {
  CollateralUpdateEvent,
  pullCollateralUpdateEvent,
  insertCollateralUpdateEvent,
  sendUpdateBatches,
} from '@voltz-protocol/bigquery-v2';
import { getEnvironmentV2 } from '../services/envVars';

export const handleCollateralUpdate = async (event: CollateralUpdateEvent) => {
  const environmentTag = getEnvironmentV2();
  const existingEvent = await pullCollateralUpdateEvent(
    environmentTag,
    event.id,
  );

  if (existingEvent) {
    return;
  }

  const updateBatch = insertCollateralUpdateEvent(environmentTag, event);
  await sendUpdateBatches([updateBatch]);
};
