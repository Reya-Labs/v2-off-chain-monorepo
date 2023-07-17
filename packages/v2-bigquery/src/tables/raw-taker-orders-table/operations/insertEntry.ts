import { UpdateBatch, TableType } from '../../../types';
import { TakerOrderEvent } from '../specific';
import { getInsertEntryBatch } from '../../../utils/raw-events-support/getInsertEntryBatch';

export const insertTakerOrderEvent = (
  environmentV2Tag: string,
  event: TakerOrderEvent,
): UpdateBatch => {
  return getInsertEntryBatch(
    environmentV2Tag,
    TableType.raw_taker_order,
    event,
  );
};
