// Swap rows do NOT change in time
export type BigQuerySwapRow = {
  eventId: string;
  vammAddress: string;
  ownerAddress: string;
  tickLower: number;
  tickUpper: number;

  variableTokenDelta: number;
  fixedTokenDeltaUnbalanced: number;
  feePaidToLps: number;

  eventBlockNumber: number;
  eventTimestamp: number;
  rowLastUpdatedTimestamp: number;

  rateOracle: string;
  underlyingToken: string;
  marginEngineAddress: string;
  chainId: number;
};

// Mint or Burn rows do NOT change in time
export type BigQueryMintOrBurnRow = {
  eventId: string;
  vammAddress: string;
  ownerAddress: string;
  tickLower: number;
  tickUpper: number;

  notionalDelta: number;

  eventBlockNumber: number;
  eventTimestamp: number;
  rowLastUpdatedTimestamp: number;

  rateOracle: string;
  underlyingToken: string;
  marginEngineAddress: string;
  chainId: number;
};

// Position rows change in time
export type BigQueryPositionRow = {
  marginEngineAddress: string; // immutable
  vammAddress: string; // immutable
  ownerAddress: string; // immutable
  tickLower: number; // immutable
  tickUpper: number; // immutable
  realizedPnLFromSwaps: number;
  realizedPnLFromFeesPaid: number;
  netNotionalLocked: number;
  netFixedRateLocked: number;
  lastUpdatedBlockNumber: number;
  notionalLiquidityProvided: number;
  realizedPnLFromFeesCollected: number;
  netMarginDeposited: number;
  rateOracleIndex: number; // immutable
  rowLastUpdatedTimestamp: number;
  fixedTokenBalance: number;
  variableTokenBalance: number;
  positionInitializationBlockNumber: number; // immutable
  rateOracle: string; // immutable
  underlyingToken: string; // immutable
  chainId: number; // immutable
  cashflowLiFactor: number;
  cashflowTimeFactor: number;
  cashflowFreeTerm: number;
  liquidity: number;
};

// Pool rows do NOT change in time
export type BigQueryPoolRow = {
  chainId: number; // immutable
  factory: string; // immutable

  deploymentBlockNumber: number; // immutable
  deploymentTimestampInMS: number; // immutable
  rowLastUpdatedTimestampInMS: number;

  vamm: string; // immutable
  marginEngine: string; // immutable
  rateOracle: string; // immutable
  protocolId: number; // immutable

  tickSpacing: number; // immutable

  termStartTimestampInMS: number; // immutable
  termEndTimestampInMS: number; // immutable

  tokenId: string; // immutable
  tokenName: string; // immutable
  tokenDecimals: number; // immutable

  hidden: boolean;
  traderHidden: boolean;
  traderWithdrawable: boolean;

  minLeverageAllowed: number;

  rollover: string;

  // Indicates if Voltz protocol V2 is used for the pool
  isV2: boolean;
};

export type BigQueryHistoricalRateRow = {
  rate: number;
  timestamp: number;
};

export type BigQueryMarginUpdateRow = {
  eventId: string;
  vammAddress: string;
  ownerAddress: string;
  tickLower: number;
  tickUpper: number;

  marginDelta: number;

  eventBlockNumber: number;
  eventTimestamp: number;
  rowLastUpdatedTimestamp: number;

  rateOracle: string;
  underlyingToken: string;
  marginEngineAddress: string;
  chainId: number;
};

export type BigQueryVoyageRow = {
  id: 'v2Voyage';
  timestamp: number | null; // UNIX milliseconds
};

export type BigQueryVoyage = {
  id: number;
  startTimestamp: number;
  endTimestamp: number;
};

export type SDKVoyage = {
  id: number;
  status: 'achieved' | 'notAchieved' | 'notStarted' | 'inProgress';
  timestamp: number | null; // UNIX milliseconds
};
