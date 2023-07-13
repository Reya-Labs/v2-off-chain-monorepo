import { UpdateBatch, TableType } from '../../../types';
import { getTableFullName } from '../../../table-infra/getTableName';
import { ProductPositionUpdatedEvent } from '../specific';

export const insertProductPositionUpdatedEvent = (
  environmentV2Tag: string,
  event: ProductPositionUpdatedEvent,
): UpdateBatch => {
  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_product_position_updated,
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
    ${event.baseDelta},
    ${event.quoteDelta}
  `;

  const sqlTransactionQuery = `INSERT INTO \`${tableName}\` VALUES (${row});`;
  return [sqlTransactionQuery];
};
