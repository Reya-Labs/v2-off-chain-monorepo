import {
  DatedIRSPositionSettledEvent,
  insertDatedIRSPositionSettledEvent,
  pullDatedIRSPositionSettledEvent,
  sendUpdateBatches,
} from '@voltz-protocol/bigquery-v2';
import { getEnvironmentV2 } from '../services/envVars';

export const handleDatedIRSPositionSettled = async (
  event: DatedIRSPositionSettledEvent,
) => {
  const environmentTag = getEnvironmentV2();
  const existingEvent = await pullDatedIRSPositionSettledEvent(
    environmentTag,
    event.id,
  );

  if (existingEvent) {
    return;
  }

  const updateBatch = insertDatedIRSPositionSettledEvent(environmentTag, event);
  await sendUpdateBatches([updateBatch]);
};
