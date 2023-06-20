import { bqNumericToNumber } from '../utils/converters';
import { TableType } from '../types';
import { getTableFullName } from '../utils/getTableName';
import { Address } from '@voltz-protocol/commons-v2';

export type MarketEntry = {
  chainId: number;
  marketId: string;
  quoteToken: Address;
  oracleAddress: Address;
  feeCollectorAccountId: string;
  atomicMakerFee: number;
  atomicTakerFee: number;
};

export type MarketEntryUpdate = {
  quoteToken?: Address;
  oracleAddress?: string;
  feeCollectorAccountId?: string;
  atomicMakerFee?: number;
  atomicTakerFee?: number;
};

export const tableName = getTableFullName(TableType.markets);

export const mapToMarketEntry = (row: any): MarketEntry => ({
  chainId: row.chainId,
  marketId: row.marketId,
  quoteToken: row.quoteToken,
  oracleAddress: row.oracleAddress,
  feeCollectorAccountId: row.feeCollectorAccountId,
  atomicMakerFee: bqNumericToNumber(row.atomicMakerFee),
  atomicTakerFee: bqNumericToNumber(row.atomicTakerFee),
});
