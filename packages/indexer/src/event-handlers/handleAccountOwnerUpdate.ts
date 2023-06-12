import {
  AccountOwnerUpdateEvent,
  pullAccountOwnerUpdateEvent,
  insertAccountOwnerUpdateEvent,
  pullAccountEntry,
  updateAccountEntry,
} from '@voltz-protocol/bigquery-v2';

export const handleAccountOwnerUpdate = async (
  event: AccountOwnerUpdateEvent,
) => {
  const existingEvent = await pullAccountOwnerUpdateEvent(event.id);

  if (existingEvent) {
    return;
  }

  await insertAccountOwnerUpdateEvent(event);

  const existingAccount = await pullAccountEntry(
    event.chainId,
    event.accountId,
  );

  if (!existingAccount) {
    throw new Error(
      `Failed to index AccountOwnerUpdate event for non-existing account ${event.accountId}`,
    );
  }

  await updateAccountEntry(event.chainId, event.accountId, {
    owner: event.newOwner,
  });
};
