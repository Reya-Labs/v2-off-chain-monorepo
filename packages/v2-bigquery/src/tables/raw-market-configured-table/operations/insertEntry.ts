import { UpdateBatch, TableType } from '../../../types';
import { getTableFullName } from '../../../table-infra/getTableName';
import { MarketConfiguredEvent } from '../specific';

export const insertMarketConfiguredEvent = (
  environmentV2Tag: string,
  event: MarketConfiguredEvent,
): UpdateBatch => {
  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_market_configured,
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
    "${event.marketId}", 
    "${event.quoteToken}"
  `;

  const sqlTransactionQuery = `INSERT INTO \`${tableName}\` VALUES (${row});`;
  return [sqlTransactionQuery];
};
