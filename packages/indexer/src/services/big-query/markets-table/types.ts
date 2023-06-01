import { Address } from '../../../utils/types';

export type MarketEntry = {
  chainId: number;
  marketId: string;
  quoteToken: Address;
  oracleAddress: string;
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
