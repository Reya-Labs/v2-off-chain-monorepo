import { AccountOwnerUpdateEvent } from '../../utils/eventTypes';

export const mapToAccountOwnerUpdateEvent = (
  row: any,
): AccountOwnerUpdateEvent => ({
  id: row.id,
  type: row.type,

  chainId: row.chainId,
  source: row.source,

  blockTimestamp: row.blockTimestamp,
  blockNumber: row.blockNumber,
  blockHash: row.blockHash,

  transactionIndex: row.transactionIndex,
  transactionHash: row.transactionHash,
  logIndex: row.logIndex,

  accountId: row.accountId,
  newOwner: row.newOwner,
});
