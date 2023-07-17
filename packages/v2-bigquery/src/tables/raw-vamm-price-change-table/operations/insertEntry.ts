import { UpdateBatch, TableType } from '../../../types';
import { VammPriceChangeEvent } from '../specific';
import { getInsertEntryBatch } from '../../../utils/raw-events-support/getInsertEntryBatch';

export const insertVammPriceChangeEvent = (
  environmentV2Tag: string,
  event: VammPriceChangeEvent,
): UpdateBatch => {
  return getInsertEntryBatch(
    environmentV2Tag,
    TableType.raw_vamm_price_change,
    event,
  );
};
