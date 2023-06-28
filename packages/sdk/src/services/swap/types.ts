import { BigNumber, Signer } from 'ethers';
import { PoolConfig, PoolInfo } from '../../gateway/types';

/**
 * @dev Full list of swap details
 */
export type CompleteSwapDetails = PoolInfo & SwapUserInputs;

/**
 * @dev Params required to encode periphery command
 */
export type SwapPeripheryParameters = Required<PoolConfig & SwapUserInputs>;

export type SwapUserInputs = {
  owner: Signer;
  baseAmount: BigNumber;
  margin: BigNumber;
  liquidatorBooster: BigNumber;
  fixedRateLimit?: BigNumber;
};

/**
 * @dev Swap flow inputs, provided by client (e.g. UI)
 */
export type SwapArgs = {
  ammId: string;
  signer: Signer;
  notional: number;
  margin: number;
  fixedRateLimit?: number; // e.g. 0.0125 = 1.25%
};

export type InfoPostSwap = {
  marginRequirement: number;
  maxMarginWithdrawable: number;
  availableNotional: number;
  fee: number;
  slippage: number;
  averageFixedRate: number;
  fixedTokenDeltaBalance: number;
  variableTokenDeltaBalance: number;
  fixedTokenDeltaUnbalanced: number;
  gasFee: {
    value: number;
    token: 'ETH' | 'AVAX';
  };
};
