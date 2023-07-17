import { UpdateBatch, TableType } from '../../../types';
import { DepositedWithdrawnEvent } from '../specific';
import { getInsertEntryBatch } from '../../../utils/raw-events-support/getInsertEntryBatch';

export const insertDepositedWithdrawnEvent = (
  environmentV2Tag: string,
  event: DepositedWithdrawnEvent,
): UpdateBatch => {
  return getInsertEntryBatch(
    environmentV2Tag,
    TableType.raw_deposited_withdrawn,
    event,
  );
};
