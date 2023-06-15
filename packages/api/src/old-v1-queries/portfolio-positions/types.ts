export type PortfolioPositionAMM = {
  id: string;
  chainId: number;

  marginEngineAddress: string;

  isBorrowing: boolean;
  // Indicates if Voltz protocol V2 is used for the pool
  isV2: boolean;
  market:
    | 'Aave V2'
    | 'Aave V3'
    | 'Compound'
    | 'Lido'
    | 'Rocket'
    | 'GMX:GLP'
    | 'SOFR';

  rateOracle: {
    address: string;
    protocolId: number;
  };

  underlyingToken: {
    address: string;
    name: 'eth' | 'usdc' | 'usdt' | 'dai';
    tokenDecimals: number;
  };

  termEndTimestampInMS: number;
  termStartTimestampInMS: number;
};

export type PortfolioPosition = {
  id: string;
  type: 'LP' | 'Variable' | 'Fixed';
  creationTimestampInMS: number;

  ownerAddress: string;

  tickLower: number;
  tickUpper: number;

  fixLow: number;
  fixHigh: number;

  tokenPriceUSD: number;
  notionalProvided: number;
  notionalTraded: number;
  notional: number;
  margin: number;

  status: {
    health: 'healthy' | 'danger' | 'warning';
    variant: 'matured' | 'settled' | 'active';
    currentFixed: number;
    receiving: number;
    paying: number;
  };

  unrealizedPNL: number;
  realizedPNLFees: number;
  realizedPNLCashflow: number;
  realizedPNLTotal: number;

  amm: PortfolioPositionAMM;
};
