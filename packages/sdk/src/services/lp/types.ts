import { BigNumber, Signer } from 'ethers';
import { PoolConfig, PoolInfo } from '../../gateway/types';

/**
 * @dev Full list of swap details
 */
export type CompleteLpDetails = PoolInfo & LpUserInputs;

/**
 * @dev Params required to encode periphery command
 */
export type LpPeripheryParameters = Required<PoolConfig & LpUserInputs>;

export type LpUserInputs = {
  ownerAddress: string;
  liquidityAmount: BigNumber;
  margin: BigNumber;
  liquidatorBooster: BigNumber;
  tickLower: number;
  tickUpper: number;
};

/**
 * @dev Swap flow inputs, provided by client (e.g. UI)
 */
export type LpArgs = {
  ammId: string;
  signer: Signer;
  notional: number;
  margin: number;
  fixedHigh: number;
  fixedLow: number;
};

export type InfoPostLp = {
  marginRequirement: number;
  maxMarginWithdrawable: number;
  maxLeverage: number;
  fee: number;
  gasFee: {
    value: number;
    token: 'ETH' | 'AVAX';
  };
};
