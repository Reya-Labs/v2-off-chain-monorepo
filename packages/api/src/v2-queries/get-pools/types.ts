export type V2Pool = {
  id: string;
  chainId: number;

  marketId: string;

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

  currentFixedRate: number;
  fixedRateChange: number;

  currentLiquidityIndex: number;
  currentVariableRate: number;
  variableRateChange: number;
  rateChangeLookbackWindowMS: number;

  coreAddress: string;
  productAddress: string;
  exchangeAddress: string;

  // Indicates if Voltz protocol V2 is used for the pool
  isV2: boolean;
};
