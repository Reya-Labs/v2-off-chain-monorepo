import { V2Pool } from '../get-pools/types';

export type PortfolioPositionV2 = {
  id: string;

  ownerAddress: string;
  type: 'LP' | 'Variable' | 'Fixed';
  creationTimestampInMS: number;

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

  amm: V2Pool;
};
