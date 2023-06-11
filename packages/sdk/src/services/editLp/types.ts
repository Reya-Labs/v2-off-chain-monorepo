import { BigNumber, Signer } from 'ethers';
import { PositionInfo } from '../editSwap';
import { LpUserInputs } from '../lp';
import { PoolConfig } from '../swap';

/**
 * @dev Full list of swap details
 */
export type CompleteEditLpDetails = PositionInfo & LpUserInputs;

/**
 * @dev Params required to encode periphery command
 */
export type LpPeripheryParameters = Required<PoolConfig & LpUserInputs>;

/**
 * @dev Swap flow inputs, provided by client (e.g. UI)
 */
export type LpArgs = {
  poolId: string;
  positionId: string;
  signer: Signer;
  notionalAmount: number;
  marginAmount: number;
  fixedRateUpper: number;
  fixedRateLower: number;
};
