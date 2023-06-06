import { getBigQuery } from '../../client';
import { getTableFullName } from '../../utils/getTableName';
import { TableType } from '../../types';
import { ProductPositionUpdatedEvent } from '../../../utils/eventTypes';
import { mapToProductPositionUpdatedEvent } from '../mapper';

export const pullProductPositionUpdatedEvent = async (
  id: string,
): Promise<ProductPositionUpdatedEvent | null> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(TableType.raw_product_position_updated);

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE id="${id}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapToProductPositionUpdatedEvent(rows[0]);
};
