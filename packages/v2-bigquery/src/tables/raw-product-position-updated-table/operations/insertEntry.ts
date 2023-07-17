import { UpdateBatch, TableType } from '../../../types';
import { ProductPositionUpdatedEvent } from '../specific';
import { getInsertEntryBatch } from '../../../utils/raw-events-support/getInsertEntryBatch';

export const insertProductPositionUpdatedEvent = (
  environmentV2Tag: string,
  event: ProductPositionUpdatedEvent,
): UpdateBatch => {
  return getInsertEntryBatch(
    environmentV2Tag,
    TableType.raw_product_position_updated,
    event,
  );
};
