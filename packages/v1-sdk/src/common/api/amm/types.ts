export type AMMInfo = {
  isEth: boolean;
  marginEngineAddress: string;
  underlyingTokenDecimals: number;
};

export type RawAMM = {
  chainId: number;
  vamm: string;
  marginEngine: string;
  rateOracle: string;
  protocolId: number;

  tickSpacing: number;
  termStartTimestampInMS: number;
  termEndTimestampInMS: number;

  tokenId: string;
  tokenName: 'USDC' | 'ETH' | 'USDT' | 'DAI';
  tokenDecimals: number;
  isV2: boolean;
};
