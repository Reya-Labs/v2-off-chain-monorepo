import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';
import { UpdateBatch } from '../../types';
import { DatedIRSPositionSettledEvent } from '../specific';

export const insertDatedIRSPositionSettledEvent = (
  environmentV2Tag: string,
  event: DatedIRSPositionSettledEvent,
): UpdateBatch => {
  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_dated_irs_position_settled,
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
    "${event.productId}",
    "${event.marketId}",
    ${event.maturityTimestamp},
    "${event.collateralType}",
    ${event.settlementCashflowInQuote}
  `;

  // build and fire sql query
  const sqlTransactionQuery = `INSERT INTO \`${tableName}\` VALUES (${row});`;
  return [sqlTransactionQuery];
};
