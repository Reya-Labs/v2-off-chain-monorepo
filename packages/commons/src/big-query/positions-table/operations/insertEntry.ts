import { getBigQuery } from '../../client';
import { encodePositionId } from '../positionId';
import { tableName } from '../specific';
import { PositionEntry } from '../specific';

export const insertPositionEntry = async (
  entry: Omit<PositionEntry, 'id'>,
): Promise<void> => {
  const bigQuery = getBigQuery();

  const id = encodePositionId(entry);

  const row = `
    "${id}",
    ${entry.chainId},
    "${entry.accountId}", 
    "${entry.marketId}", 
    ${entry.maturityTimestamp},
    ${entry.baseBalance},
    ${entry.quoteBalance},
    ${entry.notionalBalance},
    ${entry.liquidityBalance},
    ${entry.paidFees},
    "${entry.type}",
    ${entry.tickLower},
    ${entry.tickUpper}
  `;

  // build and fire sql query
  const sqlTransactionQuery = `INSERT INTO \`${tableName}\` VALUES (${row});`;

  const options = {
    query: sqlTransactionQuery,
    timeoutMs: 100000,
    useLegacySql: false,
  };

  await bigQuery.query(options);
};
