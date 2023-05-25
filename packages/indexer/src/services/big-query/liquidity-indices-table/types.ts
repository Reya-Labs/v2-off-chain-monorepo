import { Address } from '../../../utils/types';

export type LiquidityIndexEntry = {
  chainId: number;
  blockNumber: number;
  blockTimestamp: number;
  oracleAddress: Address;
  liquidityIndex: number;
};
