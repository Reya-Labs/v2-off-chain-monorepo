import { CollateralUpdateEvent } from '../../../../event-parsers/types';
import { getBigQuery } from '../../client';
import { getTableFullName } from '../../utils/getTableName';

export const insertCollateralUpdateEvent = async (
  event: CollateralUpdateEvent,
): Promise<void> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName('collateral_updates');

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
    "${event.collateralType}",
    ${event.collateralAmount},
    ${event.liquidatorBoosterAmount}
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
