import { TableType, UpdateBatch } from '../../../types';
import { MarketEntry } from '../specific';
import { getInsertEntryBatch } from '../../../utils/raw-events-support/getInsertEntryBatch';

export const insertMarketEntry = (
  environmentV2Tag: string,
  entry: MarketEntry,
): UpdateBatch => {
  return getInsertEntryBatch(environmentV2Tag, TableType.markets, entry);
};
