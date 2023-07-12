export type V1PoolIdData = {
  chainId: number;
  vammAddress: string;
};

export type V1PositionIdData = {
  chainId: number;
  vammAddress: string;
  ownerAddress: string;
  tickLower: number;
  tickUpper: number;
};
