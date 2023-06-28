import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';
import { UpdateBatch } from '../../types';
import { LiquidityChangeEvent } from '../specific';

export const insertLiquidityChangeEvent = (
  environmentV2Tag: string,
  event: LiquidityChangeEvent,
): UpdateBatch => {
  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_liquidity_change,
  );

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
  return [sqlTransactionQuery];
};
