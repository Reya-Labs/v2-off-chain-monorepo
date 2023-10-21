import { getBigQuery } from '../../../global';
import {
  TableType,
  getProtocolV1DatasetName,
  getTableName,
  secondsToBqDate,
} from '../../utils';
import { TrackedBigQueryPositionRow } from '../pull-data/pullAllPositions';

async function bq_batch_insert(table: any, rows: any, batch_size = 1000) {
  for (let i = 0; i < rows.length; i += batch_size) {
    await table.insert(rows.slice(i, Math.min(i + batch_size, rows.length)));
  }
}

export const updatePositions = async (
  processName: string,
  positions: TrackedBigQueryPositionRow[],
): Promise<void> => {
  console.log('Writing to Big Query...');

  const updates = positions
    .filter((position) => position.added || position.modified)
    .map(({ position }) => {
      return {
        ...position,
        rowLastUpdatedTimestamp: secondsToBqDate(
          position.rowLastUpdatedTimestamp,
        ),
      };
    });

  const bigQuery = getBigQuery();
  const bigQueryTable = bigQuery
    .dataset(getProtocolV1DatasetName())
    .table(getTableName(TableType.positions));

  await bq_batch_insert(bigQueryTable, updates);
};
