import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';
import { UpdateBatch } from '../../types';
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
    ${event.annualizedBaseAmount}
  `;

  const sqlTransactionQuery = `INSERT INTO \`${tableName}\` VALUES (${row});`;
  return [sqlTransactionQuery];
};
