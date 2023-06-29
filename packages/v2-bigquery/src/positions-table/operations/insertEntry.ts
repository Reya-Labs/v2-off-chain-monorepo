import { encodeV2PositionId } from '@voltz-protocol/commons-v2';
import { PositionEntry } from '../specific';
import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';
import { UpdateBatch } from '../../types';

export const insertPositionEntry = (
  environmentV2Tag: string,
  entry: Omit<PositionEntry, 'id'>,
): UpdateBatch => {
  const tableName = getTableFullName(environmentV2Tag, TableType.positions);

  const id = encodeV2PositionId(entry);

  const row = `
    "${id}",
    ${entry.chainId},
    "${entry.accountId}", 
    "${entry.marketId}", 
    ${entry.maturityTimestamp},
    ${entry.base},
    ${entry.timeDependentQuote},
    ${entry.freeQuote},
    ${entry.notional},
    ${entry.lockedFixedRate},
    ${entry.liquidity},
    ${entry.paidFees},
    "${entry.type}",
    ${entry.tickLower},
    ${entry.tickUpper},
    ${entry.creationTimestamp}
  `;

  // build and fire sql query
  const sqlTransactionQuery = `INSERT INTO \`${tableName}\` VALUES (${row});`;

  return [sqlTransactionQuery];
};
