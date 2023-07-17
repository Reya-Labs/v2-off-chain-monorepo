import { TableType } from '../../../types';
import { UpdateBatch } from '../../../types';
import { AccountCreatedEvent } from '../specific';
import { getInsertEntryBatch } from '../../../utils/raw-events-support/getInsertEntryBatch';

export const insertAccountCreatedEvent = (
  environmentV2Tag: string,
  event: AccountCreatedEvent,
): UpdateBatch => {
  return getInsertEntryBatch(
    environmentV2Tag,
    TableType.raw_account_created,
    event,
  );
};
