import {
  AccountCreatedEvent,
  pullAccountCreatedEvent,
  insertAccountCreatedEvent,
  sendUpdateBatches,
} from '@voltz-protocol/bigquery-v2';
import { getEnvironmentV2 } from '../services/envVars';

export const handleAccountCreated = async (event: AccountCreatedEvent) => {
  const environmentTag = getEnvironmentV2();

  const existingEvent = await pullAccountCreatedEvent(environmentTag, event.id);

  if (existingEvent) {
    return;
  }

  const updateBatch = insertAccountCreatedEvent(environmentTag, event);
  await sendUpdateBatches([updateBatch]);
};
