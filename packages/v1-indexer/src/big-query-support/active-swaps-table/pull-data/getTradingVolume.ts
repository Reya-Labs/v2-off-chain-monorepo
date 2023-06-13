import { BigQueryInt } from '@google-cloud/bigquery';

import { getBigQuery } from '../../../global';
import { TableType, bqNumericToNumber, getTableFullID } from '../../utils';
import { getTotalAmountInUSD } from '@voltz-protocol/commons-v2';

/**
 Get trading volume over last 30 days on given chain
 */
export const getChainTradingVolume = async (
  chainIds: number[],
): Promise<number> => {
  const bigQuery = getBigQuery();

  const volumeQuery = `
    SELECT underlyingToken, sum(abs(variableTokenDelta)) as amount
      FROM \`${getTableFullID(TableType.active_swaps)}\`
          
      WHERE (eventTimestamp > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)) AND 
            (chainId IN (${chainIds.join(',')}))
          
      GROUP BY underlyingToken
  `;

  const options = {
    query: volumeQuery,
  };

  const [rows] = await bigQuery.query(options);

  if (!rows || rows.length === 0) {
    return 0;
  }

  const parsedRows = rows.map(
    (row: { underlyingToken: string; amount: BigQueryInt }) => ({
      underlyingToken: row.underlyingToken,
      amount: bqNumericToNumber(row.amount),
    }),
  );

  const volume30DayInDollars = await getTotalAmountInUSD(parsedRows);

  return volume30DayInDollars;
};
