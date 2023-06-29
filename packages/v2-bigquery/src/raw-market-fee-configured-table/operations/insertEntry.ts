import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';
import { UpdateBatch } from '../../types';
import { MarketFeeConfiguredEvent } from '../specific';

export const insertMarketFeeConfiguredEvent = (
  environmentV2Tag: string,
  event: MarketFeeConfiguredEvent,
): UpdateBatch => {
  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_market_fee_configured,
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
    "${event.productId}", 
    "${event.marketId}", 
    "${event.feeCollectorAccountId}", 
    ${event.atomicMakerFee},
    ${event.atomicTakerFee}
  `;

  const sqlTransactionQuery = `INSERT INTO \`${tableName}\` VALUES (${row});`;
  return [sqlTransactionQuery];
};
