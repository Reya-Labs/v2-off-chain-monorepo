import {
  DepositedWithdrawnEvent,
  insertDepositedWithdrawnEvent,
  pullDepositedWithdrawnEvent,
  sendUpdateBatches,
} from '@voltz-protocol/bigquery-v2';
import { getEnvironmentV2 } from '../services/envVars';

export const handleDepositedWithdrawn = async (
  event: DepositedWithdrawnEvent,
) => {
  const environmentTag = getEnvironmentV2();
  const existingEvent = await pullDepositedWithdrawnEvent(
    environmentTag,
    event.id,
  );

  if (existingEvent) {
    return;
  }

  const updateBatch = insertDepositedWithdrawnEvent(environmentTag, event);
  await sendUpdateBatches([updateBatch]);
};
