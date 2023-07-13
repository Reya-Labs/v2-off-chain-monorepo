import { Address } from '@voltz-protocol/commons-v2';
import { bqNumericToNumber } from '../../utils/converters';

export type LiquidityIndexEntry = {
  chainId: number;
  blockNumber: number;
  blockTimestamp: number;
  oracleAddress: Address;
  liquidityIndex: number;
};

export const mapRow = (row: any): LiquidityIndexEntry => ({
  chainId: row.chainId,
  blockNumber: row.blockNumber,
  blockTimestamp: row.blockTimestamp,
  oracleAddress: row.oracleAddress,
  liquidityIndex: bqNumericToNumber(row.liquidityIndex),
});
