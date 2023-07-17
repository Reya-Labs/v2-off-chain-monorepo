import { UpdateBatch, TableType } from '../../../types';
import { LiquidityChangeEvent } from '../specific';
import { getInsertEntryBatch } from '../../../utils/raw-events-support/getInsertEntryBatch';

export const insertLiquidityChangeEvent = (
  environmentV2Tag: string,
  event: LiquidityChangeEvent,
): UpdateBatch => {
  return getInsertEntryBatch(
    environmentV2Tag,
    TableType.raw_liquidity_change,
    event,
  );
};
