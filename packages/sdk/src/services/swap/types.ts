import { BigNumber, Signer } from 'ethers';

/**
 * @dev Full list of swap details
 */
export type CompleteSwapDetails = PoolInfo & SwapUserInputs;

/**
 * @dev Params required to encode periphery command
 */
export type SwapPeripheryParameters = Required<PoolConfig & SwapUserInputs>;

export type PoolConfig = {
  productAddress: string;
  maturityTimestamp: number;
  marketId: string;
  quoteTokenAddress: string;
};

/**
 * @dev Pool information retreived from API
 */
export type PoolInfo = PoolConfig & {
  currentFixedRate: number;
  currentLiquidityIndex: number;
};

export type SwapUserInputs = {
  owner: Signer;
  baseAmount: BigNumber;
  margin: BigNumber;
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
