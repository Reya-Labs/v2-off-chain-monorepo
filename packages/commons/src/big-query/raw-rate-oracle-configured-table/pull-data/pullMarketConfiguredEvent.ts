import { getBigQuery } from '../../client';
import { getTableFullName } from '../../utils/getTableName';
import { TableType } from '../../types';
import { RateOracleConfiguredEvent } from '../../../utils/eventTypes';
import { mapToRateOracleConfiguredEvent } from '../mapper';

export const pullRateOracleConfiguredEvent = async (
  id: string,
): Promise<RateOracleConfiguredEvent | null> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(TableType.raw_rate_oracle_configured);

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE id="${id}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapToRateOracleConfiguredEvent(rows[0]);
};
