import {
  AccountCreatedEvent,
  pullAccountCreatedEvent,
  insertAccountCreatedEvent,
  insertAccountEntry,
} from '@voltz-protocol/bigquery-v2';

export const handleAccountCreated = async (event: AccountCreatedEvent) => {
  const existingEvent = await pullAccountCreatedEvent(event.id);

  if (existingEvent) {
    return;
  }

  await insertAccountCreatedEvent(event);

  await insertAccountEntry(event);
};
