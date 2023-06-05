import { Address } from '../../utils/convertLowercase';

export type LiquidityIndexEntry = {
  chainId: number;
  blockNumber: number;
  blockTimestamp: number;
  oracleAddress: Address;
  liquidityIndex: number;
};
