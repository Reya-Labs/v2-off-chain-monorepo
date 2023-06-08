import { BigNumberish, providers, Signer } from 'ethers';
import { PositionInfo } from '../../common/api/position/types';
import { AMMInfo } from '../../common/api/amm/types';

// swap

export type SimulateSwapArgs = {
  ammId: string;
  isFT: boolean;
  notional: number;
  margin: number;
  fixedRateLimit?: number;
  provider: providers.Provider;
  signer?: Signer;
};

export type SwapArgs = {
  ammId: string;
  isFT: boolean;
  notional: number;
  margin: number;
  fixedRateLimit?: number;
  signer: Signer;
};

export type EditSwapArgs = {
  positionId: string;
  isFT: boolean;
  notional: number;
  margin: number;
  fixedRateLimit?: number;
  signer: Signer;
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

// rolloverAndSwap

export type RolloverAndSwapArgs = {
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
  maturedMarginEngineAddress: string;
  maturedPositionOwnerAddress: string;
  maturedPositionSettlementBalance: number;
  maturedPositionTickLower: number;
  maturedPositionTickUpper: number;
};

export type RolloverAndSwapPeripheryParams = {
  maturedMarginEngineAddress: string;
  maturedPositionOwnerAddress: string;
  maturedPositionTickLower: BigNumberish;
  maturedPositionTickUpper: BigNumberish;
  newSwapPeripheryParams: SwapPeripheryParams;
};

// rolloverAndLp

export type RolloverAndLpArgs = {
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
  maturedMarginEngineAddress: string;
  maturedPositionOwnerAddress: string;
  maturedPositionSettlementBalance: number;
  maturedPositionTickLower: number;
  maturedPositionTickUpper: number;
};

export type RolloverAndLpPeripheryParams = {
  maturedMarginEngineAddress: string;
  maturedPositionOwnerAddress: string;
  maturedPositionTickLower: BigNumberish;
  maturedPositionTickUpper: BigNumberish;
  newLpPeripheryParams: LpPeripheryParams;
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
  positionId: string;
  signer: Signer;
};

export type SettlePeripheryParams = {
  marginEngineAddress: string;
  positionOwnerAddress: string;
  tickLower: BigNumberish;
  tickUpper: BigNumberish;
};

// updateMargin

export type UpdateMarginArgs = {
  fixedLow: number;
  fixedHigh: number;
  margin: number;
  underlyingTokenAddress: string;
  underlyingTokenDecimals: number;
  tickSpacing: number;
  chainId: number;
  peripheryAddress: string;
  marginEngineAddress: string;
  provider: providers.Provider;
  signer: Signer;
  fullyWithdraw: boolean;
};

export type UpdateMarginPeripheryParams = {
  marginEngineAddress: string;
  tickLower: BigNumberish;
  tickUpper: BigNumberish;
  marginDelta: BigNumberish;
  fullyWithdraw: boolean;
};

// token

export type ApprovePeripheryArgs = {
  chainId: number;
  tokenAddress: string;
  signer: Signer;
};

export type GetAllowanceArgs = {
  isEth: boolean;
  chainId: number;
  tokenAddress: string;
  tokenDecimals: number;
  walletAddress: string;
  provider: providers.Provider;
};

export type GetBalanceArgs = {
  isEth: boolean;
  tokenAddress: string;
  tokenDecimals: number;
  walletAddress: string;
  provider: providers.Provider;
};
