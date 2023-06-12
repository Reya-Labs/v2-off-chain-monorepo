import { CompleteSwapDetails, PoolConfig, SwapUserInputs } from '../swap';
import { providers } from 'ethers';

export type GetAvailableNotionalArgs = {
  isFT: boolean;
  chainId: number;
  tokenDecimals: number;
  params: CompleteSwapDetails;
};

export type GetMaxLeverageArgs = {
  isFT: boolean;
  chainId: number;
  tokenDecimals: number;
  params: PoolConfig & SwapUserInputs;
};

export type GetPoolSwapInfoResults = {
  availableNotionalFixedTaker: number;
  availableNotionalVariableTaker: number;
  maxLeverageFixedTaker: number;
  maxLeverageVariableTaker: number;
};

export type GetPoolSwapInfoArgs = {
  ammId: string;
  isFixedTaker: boolean;
  provider: providers.Provider;
};

export type GetPoolSwapInfoOneSideArgs = GetAvailableNotionalArgs;

export type GetPoolSwapInfoOneSideArgsResults = {
  availableNotional: number;
  maxLeverage: number;
};
