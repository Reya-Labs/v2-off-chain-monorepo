import { UpdateBatch, TableType } from '../../../types';
import { AccountOwnerUpdateEvent } from '../specific';
import { getInsertEntryBatch } from '../../../utils/raw-events-support/getInsertEntryBatch';

export const insertAccountOwnerUpdateEvent = (
  environmentV2Tag: string,
  event: AccountOwnerUpdateEvent,
): UpdateBatch => {
  return getInsertEntryBatch(
    environmentV2Tag,
    TableType.raw_account_owner_updates,
    event,
  );
};
