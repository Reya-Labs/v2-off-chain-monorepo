import { UpdateBatch, TableType } from '../../../types';
import { IrsVammPool } from '../specific';
import { getInsertEntryBatch } from '../../../utils/raw-events-support/getInsertEntryBatch';

export const insertIrsVammPool = (
  environmentV2Tag: string,
  entry: IrsVammPool,
): UpdateBatch => {
  return getInsertEntryBatch(environmentV2Tag, TableType.irs_vamm_pools, entry);
};
