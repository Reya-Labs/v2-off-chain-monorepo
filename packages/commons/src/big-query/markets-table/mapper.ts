import { bqNumericToNumber } from '../utils/converters';
import { MarketEntry } from './types';

export const mapToMarketEntry = (row: any): MarketEntry => ({
  chainId: row.chainId,
  marketId: row.marketId,
  quoteToken: row.quoteToken,
  oracleAddress: row.oracleAddress,
  feeCollectorAccountId: row.feeCollectorAccountId,
  atomicMakerFee: bqNumericToNumber(row.atomicMakerFee),
  atomicTakerFee: bqNumericToNumber(row.atomicTakerFee),
});
