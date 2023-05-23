import { BigNumberish, providers, Signer } from "ethers";

// swap
export type SwapArgs = {
  isFT: boolean;
  notional: number;
  margin: number;
  fixedRateLimit?: number;
  fixedLow: number;
  fixedHigh: number;
  underlyingTokenAddress: string;
  underlyingTokenDecimals: number;
  tickSpacing: number;
  chainId: number;
  peripheryAddress: string;
  marginEngineAddress: string;
  provider: providers.Provider;
  signer: Signer;
  isEth: boolean;
  underlyingTokenDecimals: number;
};

export type SwapPeripheryParams = {
  marginEngineAddress: string;
  isFT: boolean;
  notional: BigNumberish;
  sqrtPriceLimitX96: BigNumberish;
  tickLower: BigNumberish;
  tickUpper: BigNumberish;
  marginDelta: BigNumberish;
};
