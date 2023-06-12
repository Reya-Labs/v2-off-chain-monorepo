import { getBigQuery } from '../../client';
import { AccountOwnerUpdateEvent, tableName } from '../specific';

export const insertAccountOwnerUpdateEvent = async (
  event: AccountOwnerUpdateEvent,
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
    "${event.accountId}", 
    "${event.newOwner}"
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
