import { BasePool } from './BasePool';

export type V2Pool = BasePool & {
  marketId: string;

  makerFee: number;
  takerFee: number;

  currentFixedRate: number;
  // TODO: Costin, AB, Ioana or Alex fill this with proper value, make it non-nullable
  payFixedRate?: number;
  // TODO: Costin, AB, Ioana or Alex fill this with proper value, make it non-nullable
  receiveFixedRate?: number;
  // TODO: Costin, AB, Ioana or Alex fill this with proper value, make it non-nullable
  liquidityAvailableFixed?: number;
  // TODO: Costin, AB, Ioana or Alex fill this with proper value, make it non-nullable
  liquidityAvailableVariable?: number;
  fixedRateChange: number;

  currentLiquidityIndex: number;
  currentVariableRate: number;
  variableRateChange: number;
  rateChangeLookbackWindowMS: number;

  coreAddress: string;
  productAddress: string;
  exchangeAddress: string;
};
