import { LiquidityChangeEvent } from '../../../utils/eventTypes';
import { getBigQuery } from '../../client';
import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';

export const insertLiquidityChangeEvent = async (
  event: LiquidityChangeEvent,
): Promise<void> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(TableType.raw_liquidity_change);

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
    "${event.marketId}",
    ${event.maturityTimestamp},
    "${event.quoteToken}",
    ${event.tickLower},
    ${event.tickUpper},
    ${event.liquidityDelta}
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
