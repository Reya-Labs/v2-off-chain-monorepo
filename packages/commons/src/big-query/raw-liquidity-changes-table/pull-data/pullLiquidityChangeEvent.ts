import { LiquidityChangeEvent } from '../../../utils/eventTypes';
import { getBigQuery } from '../../client';
import { mapToLiquidityChangeEvent } from '../mapper';
import { getTableFullName } from '../../utils/getTableName';
import { TableType } from '../../types';

export const pullLiquidityChangeEvent = async (
  id: string,
): Promise<LiquidityChangeEvent | null> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(TableType.raw_liquidity_change);

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE id="${id}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapToLiquidityChangeEvent(rows[0]);
};
