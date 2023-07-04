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
  ownerAddress: string;
  baseAmount: BigNumber;
  margin: BigNumber;
  liquidatorBooster: BigNumber;
};

/**
 * @dev Swap flow inputs, provided by client (e.g. UI)
 */
export type SwapArgs = {
  ammId: string;
  signer: Signer;
  notional: number;
  margin: number;
};

export type InfoPostSwap = {
  marginRequirement: number;
  maxMarginWithdrawable: number;
  fee: number;
  averageFixedRate: number;
  variableTokenDeltaBalance: number;
  gasFee: {
    value: number;
    token: 'ETH' | 'AVAX' | 'USDCf';
  };
};
