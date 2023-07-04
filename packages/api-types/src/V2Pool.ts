import { BasePool } from './BasePool';

export type V2Pool = BasePool & {
  marketId: string;

  currentFixedRate: number;
  fixedRateChange: number;

  currentLiquidityIndex: number;
  currentVariableRate: number;
  variableRateChange: number;
  rateChangeLookbackWindowMS: number;

  coreAddress: string;
  productAddress: string;
  exchangeAddress: string;
};
