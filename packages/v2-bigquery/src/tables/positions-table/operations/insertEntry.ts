import { encodeV2PositionId } from '@voltz-protocol/commons-v2';
import { PositionEntry } from '../specific';
import { TableType } from '../../../types';
import { UpdateBatch } from '../../../types';
import { getInsertEntryBatch } from '../../../utils/raw-events-support/getInsertEntryBatch';

export const insertPositionEntry = (
  environmentV2Tag: string,
  entry: Omit<PositionEntry, 'id'>,
): UpdateBatch => {
  const id = encodeV2PositionId(entry);

  return getInsertEntryBatch(environmentV2Tag, TableType.positions, {
    ...entry,
    id,
  });
};
