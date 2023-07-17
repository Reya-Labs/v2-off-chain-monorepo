import { UpdateBatch, TableType } from '../../../types';
import { LiquidationEvent } from '../specific';
import { getInsertEntryBatch } from '../../../utils/raw-events-support/getInsertEntryBatch';

export const insertLiquidationEvent = (
  environmentV2Tag: string,
  event: LiquidationEvent,
): UpdateBatch => {
  return getInsertEntryBatch(
    environmentV2Tag,
    TableType.raw_liquidation,
    event,
  );
};
