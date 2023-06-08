import { LiquidityIndexEntry } from '../liquidity-indices-table/types';
import { bqNumericToNumber } from '../utils/converters';

export const mapToLiquidityIndices = (row: any): LiquidityIndexEntry => ({
  chainId: row.chainId,
  blockNumber: row.blockNumber,
  blockTimestamp: row.blockTimestamp,
  oracleAddress: row.oracleAddress,
  liquidityIndex: bqNumericToNumber(row.liquidityIndex),
});
