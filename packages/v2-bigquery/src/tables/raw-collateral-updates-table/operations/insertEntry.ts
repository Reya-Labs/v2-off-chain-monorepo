import { UpdateBatch, TableType } from '../../../types';
import { CollateralUpdateEvent } from '../specific';
import { getInsertEntryBatch } from '../../../utils/raw-events-support/getInsertEntryBatch';

export const insertCollateralUpdateEvent = (
  environmentV2Tag: string,
  event: CollateralUpdateEvent,
): UpdateBatch => {
  return getInsertEntryBatch(
    environmentV2Tag,
    TableType.raw_collateral_updates,
    event,
  );
};
