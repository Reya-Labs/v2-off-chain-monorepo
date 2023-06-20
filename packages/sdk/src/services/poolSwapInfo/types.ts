import { CompleteSwapDetails, SwapUserInputs } from '../swap';
import { Signer } from 'ethers';
import { PoolConfig } from '../../gateway/types';

export type GetAvailableNotionalArgs = {
  isFT: boolean;
  chainId: number;
  params: CompleteSwapDetails;
};

export type GetMaxLeverageArgs = {
  isFT: boolean;
  chainId: number;
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
  signer: Signer;
};

export type GetPoolSwapInfoOneSideArgs = GetAvailableNotionalArgs;

export type GetPoolSwapInfoOneSideArgsResults = {
  availableNotional: number;
  maxLeverage: number;
};
