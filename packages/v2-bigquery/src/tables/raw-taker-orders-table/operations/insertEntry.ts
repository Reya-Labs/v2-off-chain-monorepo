import { UpdateBatch, TableType } from '../../../types';
import { getTableFullName } from '../../../table-infra/getTableName';
import { TakerOrderEvent } from '../specific';

export const insertTakerOrderEvent = (
  environmentV2Tag: string,
  event: TakerOrderEvent,
): UpdateBatch => {
  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_taker_order,
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
    ${event.executedBaseAmount},
    ${event.executedQuoteAmount},
    ${event.annualizedNotionalAmount}
  `;

  const sqlTransactionQuery = `INSERT INTO \`${tableName}\` VALUES (${row});`;
  return [sqlTransactionQuery];
};
