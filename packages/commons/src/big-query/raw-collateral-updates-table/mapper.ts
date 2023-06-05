import { CollateralUpdateEvent } from '@voltz-protocol/indexer-v2/src/event-parsers/types';
import { bqNumericToNumber } from '../utils/converters';

export const mapToCollateralUpdateEvent = (
  row: any,
): CollateralUpdateEvent => ({
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
  collateralType: row.collateralType,
  collateralAmount: bqNumericToNumber(row.collateralAmount),
  liquidatorBoosterAmount: bqNumericToNumber(row.liquidatorBoosterAmount),
});
