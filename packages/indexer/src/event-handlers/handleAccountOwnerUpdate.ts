import {
  AccountOwnerUpdateEvent,
  pullAccountOwnerUpdateEvent,
  insertAccountOwnerUpdateEvent,
  pullAccountEntry,
  updateAccountEntry,
  insertAccountEntry,
  sendUpdateBatches,
} from '@voltz-protocol/bigquery-v2';
import { getEnvironmentV2 } from '../services/envVars';

export const handleAccountOwnerUpdate = async (
  event: AccountOwnerUpdateEvent,
) => {
  const environmentTag = getEnvironmentV2();
  const existingEvent = await pullAccountOwnerUpdateEvent(
    environmentTag,
    event.id,
  );

  if (existingEvent) {
    return;
  }

  {
    const updateBatch1 = insertAccountOwnerUpdateEvent(environmentTag, event);

    const existingAccount = await pullAccountEntry(
      environmentTag,
      event.chainId,
      event.accountId,
    );

    const updateBatch2 = existingAccount
      ? updateAccountEntry(environmentTag, event.chainId, event.accountId, {
          owner: event.newOwner,
        })
      : insertAccountEntry(environmentTag, {
          chainId: event.chainId,
          accountId: event.accountId,
          owner: event.newOwner,
        });

    await sendUpdateBatches([updateBatch1, updateBatch2]);
  }
};
