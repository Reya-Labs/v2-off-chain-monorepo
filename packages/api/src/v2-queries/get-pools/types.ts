export type V2Pool = {
  id: string;
  chainId: number;

  marketId: string; // v2-only

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
    priceUSD: number;
  };

  tickSpacing: number;
  termStartTimestampInMS: number;
  termEndTimestampInMS: number;

  currentFixedRate: number; // v2-only
  fixedRateChange: number; // v2-only

  currentLiquidityIndex: number; // v2-only
  currentVariableRate: number; // v2-only
  variableRateChange: number; // v2-only
  rateChangeLookbackWindowMS: number; // v2-only

  coreAddress: string; // v2-only
  productAddress: string; // v2-only
  exchangeAddress: string; // v2-only

  // Indicates if Voltz protocol V2 is used for the pool
  isV2: boolean;
};
