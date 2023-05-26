import { MarketFeeConfiguredEvent } from '../../../../event-parsers/types';
import { getBigQuery } from '../../client';
import { getTableFullName } from '../../utils/getTableName';
import { TableType } from '../../types';
import { mapToMarketFeeConfiguredEvent } from '../mapper';

export const pullMarketFeeConfiguredEvent = async (
  id: string,
): Promise<MarketFeeConfiguredEvent | null> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(TableType.raw_fee_market_configured);

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE id="${id}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapToMarketFeeConfiguredEvent(rows[0]);
};
