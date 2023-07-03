import { BasePool } from './BasePool';

export type V2Pool = BasePool & {
  marketId: string;

  currentTick: number;
  currentFixedRate: number;
  fixedRateChange: number;

  currentLiquidityIndex: number;
  currentVariableRate: number;
  variableRateChange: number;
  rateChangeLookbackWindowMS: number;

  availableNotional: {
    short: number; // (note: it's FT for IRS)
    long: number; // (note: it's VT for IRS)
  };

  coreAddress: string;
  productAddress: string;
  exchangeAddress: string;
};
