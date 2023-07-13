import { UpdateBatch, TableType } from '../../../types';
import { getTableFullName } from '../../../table-infra/getTableName';
import { LiquidationEvent } from '../specific';

export const insertLiquidationEvent = (
  environmentV2Tag: string,
  event: LiquidationEvent,
): UpdateBatch => {
  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_liquidation,
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
    "${event.liquidatedAccountId}", 
    "${event.collateralType}",
    "${event.sender}",
    "${event.liquidatorAccountId}",
    ${event.liquidatorAccountId},
    ${event.imPreClose},
    ${event.imPostClose}
  `;

  // build and fire sql query
  const sqlTransactionQuery = `INSERT INTO \`${tableName}\` VALUES (${row});`;
  return [sqlTransactionQuery];
};
