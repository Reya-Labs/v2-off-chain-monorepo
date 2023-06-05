import { CollateralUpdateEvent } from '../../../utils/eventTypes';
import { getBigQuery } from '../../client';
import { mapToCollateralUpdateEvent } from '../mapper';
import { getTableFullName } from '../../utils/getTableName';
import { TableType } from '../../types';

export const pullCollateralUpdateEvent = async (
  id: string,
): Promise<CollateralUpdateEvent | null> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(TableType.raw_collateral_updates);

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE id="${id}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapToCollateralUpdateEvent(rows[0]);
};
