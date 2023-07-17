import { UpdateBatch, TableType } from '../../../types';
import { DatedIRSPositionSettledEvent } from '../specific';
import { getInsertEntryBatch } from '../../../utils/raw-events-support/getInsertEntryBatch';

export const insertDatedIRSPositionSettledEvent = (
  environmentV2Tag: string,
  event: DatedIRSPositionSettledEvent,
): UpdateBatch => {
  return getInsertEntryBatch(
    environmentV2Tag,
    TableType.raw_dated_irs_position_settled,
    event,
  );
};
