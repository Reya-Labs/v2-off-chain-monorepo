export type PortfolioPositionAMM = {
  id: string;
  chainId: number;

  marginEngineAddress: string;

  isBorrowing: boolean;
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

export type PortfolioPositionDetails = {
  id: string;
  variant: 'matured' | 'settled' | 'active';
  type: 'LP' | 'Variable' | 'Fixed';
  creationTimestampInMS: number;

  tokenPriceUSD: number;
  notional: number;
  margin: number;

  canEdit: boolean;
  canSettle: boolean;
  rolloverAmmId: null | string;

  realizedPNLFees: number;
  realizedPNLCashflow: number;
  realizedPNLTotal: number;

  history: HistoryTransaction[];
  amm: PortfolioPositionAMM;
};

export type HistoryTransaction = {
  type:
    | 'swap'
    | 'mint'
    | 'burn'
    | 'margin-update'
    | 'liquidation'
    | 'settlement'
    | 'maturity';
  creationTimestampInMS: number;
  notional: number;
  paidFees: number;
  fixedRate: number;
  marginDelta: number;
};

export type PositionInfo = {
  positionTickLower: number;
  positionTickUpper: number;
  ammUnderlyingTokenDecimals: number;
  ammMarginEngineAddress: string;
};
