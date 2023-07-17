import { UpdateBatch, TableType } from '../../../types';
import { IrsVammPoolEntry } from '../specific';
import { getInsertEntryBatch } from '../../../utils/raw-events-support/getInsertEntryBatch';
import { encodeV2PoolId } from '@voltz-protocol/commons-v2';

export const insertIrsVammPoolEntry = (
  environmentV2Tag: string,
  entry: Omit<IrsVammPoolEntry, 'id'>,
): UpdateBatch => {
  const id = encodeV2PoolId(entry);
  return getInsertEntryBatch(environmentV2Tag, TableType.irs_vamm_pools, {
    ...entry,
    id,
  });
};
