import { UpdateBatch, TableType } from '../../../types';
import { getInsertEntryBatch } from '../../../utils/raw-events-support/getInsertEntryBatch';
import { VammCreatedEvent } from '../specific';

export const insertVammCreatedEvent = (
  environmentV2Tag: string,
  event: VammCreatedEvent,
): UpdateBatch => {
  return getInsertEntryBatch(
    environmentV2Tag,
    TableType.raw_vamm_created,
    event,
  );
};
