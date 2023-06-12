import { getBigQuery } from '../../client';
import { RateOracleConfiguredEvent, tableName } from '../specific';

export const insertRateOracleConfiguredEvent = async (
  event: RateOracleConfiguredEvent,
): Promise<void> => {
  const bigQuery = getBigQuery();

  const row = `
    "${event.id}",
    "${event.type}",
    ${event.chainId},
    "${event.source}",
    ${event.blockTimestamp}, 
    ${event.blockNumber}, 
    "${event.blockHash}",
    ${event.transactionIndex}, 
    "${event.transactionHash}", 
    ${event.logIndex},
    "${event.marketId}", 
    "${event.oracleAddress}"
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
