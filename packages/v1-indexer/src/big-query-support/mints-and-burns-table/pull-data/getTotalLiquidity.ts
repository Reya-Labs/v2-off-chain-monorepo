import { BigQueryInt } from '@google-cloud/bigquery';

import { getBigQuery } from '../../../global';
import { TableType, bqNumericToNumber, getTableFullID } from '../../utils';
import { getTotalAmountInUSD } from '@voltz-protocol/commons-v2';
import { getCoingeckoApiKey } from '../../../common/envVars';

/**
 Get chain total liquidity
 */
export const getChainTotalLiquidity = async (
  chainIds: number[],
): Promise<number> => {
  const bigQuery = getBigQuery();

  const liquidityQuery = `
    SELECT A.underlyingToken, sum(A.notionalDelta) AS amount
    FROM \`${getTableFullID(TableType.mints_and_burns)}\` as A
    JOIN \`${getTableFullID(TableType.pools)}\` as B ON A.vammAddress = B.vamm
    WHERE B.termEndTimestampInMS > ${Date.now().valueOf()} AND (B.chainId IN (${chainIds.join(
    ',',
  )}))
    GROUP BY underlyingToken;
  `;

  const options = {
    query: liquidityQuery,
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

  try {
    const totalLiquidityInDollars = await getTotalAmountInUSD(
      parsedRows,
      getCoingeckoApiKey(),
    );

    return totalLiquidityInDollars;
  } catch (_) {
    return 0;
  }
};
