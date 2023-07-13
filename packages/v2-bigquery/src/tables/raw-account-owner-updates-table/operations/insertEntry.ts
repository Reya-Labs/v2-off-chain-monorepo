import { UpdateBatch, TableType } from '../../../types';
import { getTableFullName } from '../../../table-infra/getTableName';
import { AccountOwnerUpdateEvent } from '../specific';

export const insertAccountOwnerUpdateEvent = (
  environmentV2Tag: string,
  event: AccountOwnerUpdateEvent,
): UpdateBatch => {
  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_account_owner_updates,
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
    "${event.newOwner}"
  `;

  const sqlTransactionQuery = `INSERT INTO \`${tableName}\` VALUES (${row});`;
  return [sqlTransactionQuery];
};
