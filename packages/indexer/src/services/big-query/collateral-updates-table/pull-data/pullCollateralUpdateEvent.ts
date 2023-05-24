import { CollateralUpdateEvent } from '../../../../event-parsers/types';
import { getBigQuery } from '../../client';
import { mapToCollateralUpdateEvent } from '../../mappers';
import { getTableFullName } from '../../utils/getTableName';

export const pullCollateralUpdateEvent = async (
  id: string,
): Promise<CollateralUpdateEvent | null> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName('collateral_updates');

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE id="${id}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapToCollateralUpdateEvent(rows[0]);
};
