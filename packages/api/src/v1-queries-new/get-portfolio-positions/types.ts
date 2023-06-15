import { V1Pool } from '../get-pools/types';

export type PortfolioPositionV1 = {
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

  amm: V1Pool;
};
