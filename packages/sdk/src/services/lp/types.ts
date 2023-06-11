import { BigNumber, Signer } from 'ethers';
import { PoolConfig, PoolInfo } from '../swap';

/**
 * @dev Full list of swap details
 */
export type CompleteLpDetails = PoolInfo & LpUserInputs;

/**
 * @dev Params required to encode periphery command
 */
export type LpPeripheryParameters = Required<PoolConfig & LpUserInputs>;

export type LpUserInputs = {
  owner: Signer;
  liquidityAmount: BigNumber;
  marginAmount: BigNumber;
  fixedRateUpper: number;
  fixedRateLower: number;
};

/**
 * @dev Swap flow inputs, provided by client (e.g. UI)
 */
export type LpArgs = {
  poolId: string;
  signer: Signer;
  notionalAmount: number;
  marginAmount: number;
  fixedRateUpper: number;
  fixedRateLower: number;
};

export type InfoPostLp = {
  marginRequirement: number;
  maxMarginWithdrawable: number;
  fee: number;
  gasFee: {
    value: number;
    token: 'ETH' | 'AVAX';
  };
};
