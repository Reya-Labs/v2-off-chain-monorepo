import { BigNumberish, providers, Signer } from 'ethers';

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

// lp

export type LpArgs = {
  addLiquidity: boolean;
  fixedLow: number;
  fixedHigh: number;
  notional: number;
  margin: number;
  underlyingTokenAddress: string;
  underlyingTokenDecimals: number;
  tickSpacing: number;
  chainId: number;
  peripheryAddress: string;
  marginEngineAddress: string;
  provider: providers.Provider;
  signer: Signer;
  isEth: boolean;
};

export type LpPeripheryParams = {
  marginEngineAddress: string;
  tickLower: BigNumberish;
  tickUpper: BigNumberish;
  notional: BigNumberish;
  isMint: boolean;
  marginDelta: BigNumberish;
};

// settle

export type SettleArgs = {
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
  positionOwnerAddress: string;
};

export type SettlePeripheryParams = {
  marginEngineAddress: string;
  positionOwnerAddress: string;
  tickLower: BigNumberish;
  tickUpper: BigNumberish;
};
