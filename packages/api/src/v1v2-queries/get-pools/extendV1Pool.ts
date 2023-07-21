import { V1Pool, V1V2Pool } from '@voltz-protocol/api-sdk-v2';

export const extendV1Pool = (p: V1Pool): V1V2Pool => ({
  ...p,

  marketId: '',
  makerFee: 0,
  takerFee: 0,

  currentFixedRate: 0,
  fixedRateChange: 0,

  currentLiquidityIndex: 0,
  currentVariableRate: 0,
  variableRateChange: 0,
  rateChangeLookbackWindowMS: 0,

  coreAddress: '',
  productAddress: '',
  exchangeAddress: '',
});
