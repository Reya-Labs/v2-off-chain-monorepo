import { SupportedChainId } from '../provider';

export type V1PoolIdData = {
  chainId: SupportedChainId;
  vammAddress: string;
};

export type V1PositionIdData = {
  chainId: SupportedChainId;
  vammAddress: string;
  ownerAddress: string;
  tickLower: number;
  tickUpper: number;
};
