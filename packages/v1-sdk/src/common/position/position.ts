


export type PositionInfo = {
  positionId: string;
  tickLower: number;
  tickUpper: number;
  underlyingTokenAddress: string;
  underlyingTokenDecimals: number;
  tickSpacing: number;
  marginEngineAddress: string;
  positionOwnerAddress: string;
}

export const getPositionInfo = async (positionId: string): Promise<PositionInfo> => {
  return {
    positionId: positionId,
    tickLower: 0,
    tickUpper: 0,
    underlyingTokenAddress: '',
    underlyingTokenDecimals: 0,
    tickSpacing: 0,
    marginEngineAddress: '',
    positionOwnerAddress: '',
  }
}