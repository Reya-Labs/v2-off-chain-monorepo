export type BasePool = {
  id: string;

  chainId: number;

  tickSpacing: number;
  termStartTimestampInMS: number;
  termEndTimestampInMS: number;

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

  // Indicates if Voltz protocol V2 is used for the pool
  isV2: boolean;
  flags: {
    isGLP28Jun2023: boolean;
    isBlacklisted: boolean;
  };
};
