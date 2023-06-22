import { V2Pool } from '../get-pools/types';

export type V2PortfolioPosition = {
  id: string;

  type: 'LP' | 'Variable' | 'Fixed';
  variant: 'matured' | 'settled' | 'active';
  creationTimestampInMS: number;

  accountId: string;
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
  pool: V2Pool;
};

export type V2HistoryTransaction = {
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

export type V2PortfolioPositionDetails = V2PortfolioPosition & {
  canEdit: boolean;
  canSettle: boolean;
  rolloverMaturityTimestamp: null | number;

  history: V2HistoryTransaction[];
};
