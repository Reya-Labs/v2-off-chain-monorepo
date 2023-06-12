import { getBigQuery } from '../../client';
import { VammPriceChangeEvent, tableName } from '../specific';

export const insertVammPriceChangeEvent = async (
  event: VammPriceChangeEvent,
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
    ${event.maturityTimestamp},
    ${event.tick}
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
