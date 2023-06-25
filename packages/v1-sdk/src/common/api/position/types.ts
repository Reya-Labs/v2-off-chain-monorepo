export type PositionInfo = {
  chainId: number;
  isEth: boolean;
  positionOwnerAddress: string;
  positionTickLower: number;
  positionTickUpper: number;
  ammUnderlyingTokenDecimals: number;
  ammMarginEngineAddress: string;
  realizedPNLTotal: number;
  margin: number;
};
