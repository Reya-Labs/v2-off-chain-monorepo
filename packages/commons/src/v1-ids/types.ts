import { Address } from '../address';

export type V1PoolIdData = {
  chainId: number;
  vammAddress: Address;
};

export type V1PositionIdData = {
  chainId: number;
  vammAddress: Address;
  ownerAddress: Address;
  tickLower: number;
  tickUpper: number;
};
