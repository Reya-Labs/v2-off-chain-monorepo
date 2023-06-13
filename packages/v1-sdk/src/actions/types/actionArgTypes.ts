import { BigNumberish, providers, Signer } from 'ethers';
import { PositionInfo } from '../../common/api/position/types';
import { AMMInfo } from '../../common/api/amm/types';

// swap

export type SwapArgs = {
  ammId: string;
  notional: number;
  margin: number;
  fixedRateLimit?: number;
  signer: Signer;
};

export type EditSwapArgs = {
  positionId: string;
  notional: number;
  margin: number;
  fixedRateLimit?: number;
  signer: Signer;
};

export type GetPoolSwapInfoArgs = {
  ammId: string;
  provider: providers.Provider;
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

// rolloverWithSwap

export type RolloverAndSwapArgs = {
  maturedPositionId: string;
  ammId: string;
  isFT: boolean;
  notional: number;
  margin: number;
  fixedRateLimit?: number;
  signer: Signer;
};

export type RolloverAndSwapPeripheryParams = {
  maturedMarginEngineAddress: string;
  maturedPositionOwnerAddress: string;
  maturedPositionTickLower: BigNumberish;
  maturedPositionTickUpper: BigNumberish;
  newSwapPeripheryParams: SwapPeripheryParams;
};

// rolloverWithLp

export type RolloverAndLpArgs = {
  maturedPositionId: string;
  ammId: string;
  fixedLow: number;
  fixedHigh: number;
  notional: number;
  margin: number;
  signer: Signer;
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
  ammId: string;
  fixedLow: number;
  fixedHigh: number;
  notional: number;
  margin: number;
  signer: Signer;
};

export type EditLpArgs = {
  positionId: string;
  notional: number;
  margin: number;
  signer: Signer;
};

export type LpPeripheryParams = {
  marginEngineAddress: string;
  tickLower: BigNumberish;
  tickUpper: BigNumberish;
  notional: BigNumberish;
  isMint: boolean;
  marginDelta: BigNumberish;
};

export type GetPoolLpInfoArgs = {
  ammId: string;
  fixedHigh: number;
  fixedLow: number;
  provider: providers.Provider;
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
  positionId: string;
  margin: number;
  signer: Signer;
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
  ammId: string;
  signer: Signer;
};

export type GetAllowanceArgs = {
  ammId: string;
  signer: Signer;
};

export type GetBalanceArgs = {
  ammId: string;
  signer: Signer;
};
