import { V1Pool } from '../get-pools/types';

export type V1PortfolioPosition = {
  id: string;

  type: 'LP' | 'Variable' | 'Fixed';
  variant: 'matured' | 'settled' | 'active';
  creationTimestampInMS: number;

  ownerAddress: string;

  tickLower: number;
  tickUpper: number;

  fixLow: number;
  fixHigh: number;

  notionalProvided: number;
  notionalTraded: number;
  notional: number;
  margin: number;

  unrealizedPNL: number;
  realizedPNLFees: number;
  realizedPNLCashflow: number;
  realizedPNLTotal: number;

  health: 'healthy' | 'danger' | 'warning';
  receiving: number;
  paying: number;

  poolCurrentFixedRate: number;
  pool: V1Pool;
};

export type V1HistoryTransaction = {
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

export type V1PortfolioPositionDetails = V1PortfolioPosition & {
  canEdit: boolean;
  canSettle: boolean;
  rolloverPoolId: null | string;

  history: V1HistoryTransaction[];
};
