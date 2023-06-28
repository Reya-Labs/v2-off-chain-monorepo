import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';
import { UpdateBatch } from '../../types';
import { AccountCreatedEvent } from '../specific';

export const insertAccountCreatedEvent = (
  environmentV2Tag: string,
  event: AccountCreatedEvent,
): UpdateBatch => {
  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_account_created,
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
    "${event.owner}"
  `;

  // build and fire sql query
  const sqlTransactionQuery = `INSERT INTO \`${tableName}\` VALUES (${row});`;

  return [sqlTransactionQuery];
};
