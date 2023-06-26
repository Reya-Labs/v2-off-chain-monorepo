import { BasePool } from './BasePool';

export type BasePortfolioPosition = {
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
  pool: BasePool;
};
