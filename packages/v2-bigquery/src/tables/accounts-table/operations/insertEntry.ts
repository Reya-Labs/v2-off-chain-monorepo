import { UpdateBatch, TableType } from '../../../types';
import { AccountEntry } from '../specific';
import { getInsertEntryBatch } from '../../../utils/raw-events-support/getInsertEntryBatch';

export const insertAccountEntry = (
  environmentV2Tag: string,
  entry: AccountEntry,
): UpdateBatch => {
  return getInsertEntryBatch(environmentV2Tag, TableType.accounts, entry);
};
