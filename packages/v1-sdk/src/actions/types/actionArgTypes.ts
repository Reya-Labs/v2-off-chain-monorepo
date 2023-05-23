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
  tickSpacing: number;
  chainId: number;
  peripheryAddress: string;
  vammAddress: string;
  provider: providers.Provider;
  signer: Signer | null;
  isEth: boolean;
};

export type SwapPeripheryParams = {
  marginEngine: string;
  isFT: boolean;
  notional: BigNumberish;
  sqrtPriceLimitX96: BigNumberish;
  tickLower: BigNumberish;
  tickUpper: BigNumberish;
  marginDelta: BigNumberish;
};
