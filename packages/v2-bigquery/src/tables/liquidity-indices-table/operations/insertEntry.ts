import { TableType } from '../../../types';
import { UpdateBatch } from '../../../types';
import { LiquidityIndexEntry } from '../specific';
import { getInsertEntryBatch } from '../../../utils/raw-events-support/getInsertEntryBatch';

export const insertLiquidityIndex = (
  environmentV2Tag: string,
  entry: LiquidityIndexEntry,
): UpdateBatch => {
  return getInsertEntryBatch(
    environmentV2Tag,
    TableType.liquidity_indices,
    entry,
  );
};
