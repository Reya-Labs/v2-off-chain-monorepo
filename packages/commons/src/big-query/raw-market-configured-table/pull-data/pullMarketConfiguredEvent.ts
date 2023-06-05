import { MarketConfiguredEvent } from '../../../utils/eventTypes';
import { getBigQuery } from '../../client';
import { getTableFullName } from '../../utils/getTableName';
import { TableType } from '../../types';
import { mapToMarketConfiguredEvent } from '../mapper';

export const pullMarketConfiguredEvent = async (
  id: string,
): Promise<MarketConfiguredEvent | null> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(TableType.raw_market_configured);

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE id="${id}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapToMarketConfiguredEvent(rows[0]);
};
