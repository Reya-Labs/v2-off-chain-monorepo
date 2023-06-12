import { BigQueryInt } from '@google-cloud/bigquery';

import { getBigQuery } from '../../../global';
import { bqNumericToNumber, getTableFullID } from '../../utils';
import { getTotalAmountInUSD } from '@voltz-protocol/commons-v2';

/**
 Get chain total liquidity
 */
export const getChainTotalLiquidity = async (
  chainIds: number[],
): Promise<number> => {
  const bigQuery = getBigQuery();

  const liquidityQuery = `
    SELECT A.underlyingToken, sum(A.notionalDelta) AS amount
    FROM \`${getTableFullID('mints_and_burns')}\` as A
    JOIN \`${getTableFullID('pools')}\` as B ON A.vammAddress = B.vamm
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

  const totalLiquidityInDollars = await getTotalAmountInUSD(parsedRows);

  return totalLiquidityInDollars;
};
