import {
  AccountOwnerUpdateEvent,
  pullAccountOwnerUpdateEvent,
  insertAccountOwnerUpdateEvent,
  pullAccountEntry,
  updateAccountEntry,
  insertAccountEntry,
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
    await insertAccountEntry({
      chainId: event.chainId,
      accountId: event.accountId,
      owner: event.newOwner,
    });
  } else {
    await updateAccountEntry(event.chainId, event.accountId, {
      owner: event.newOwner,
    });
  }
};
