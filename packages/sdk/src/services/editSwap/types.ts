import { BigNumber, Signer } from 'ethers';
import { PoolConfig, PoolInfo, SwapUserInputs } from '../swap';

/**
 * @dev Full list of swap details
 */
export type CompleteEditSwapDetails = PositionInfo & EditSwapUserInputs;

/**
 * @dev Params required to encode periphery command
 */
export type EditSwapPeripheryParameters = Required<
  PoolConfig & EditSwapUserInputs
>;

type EditSwapUserInputs = SwapUserInputs & {
  accountId: string;
};

/**
 * @dev Position information retreived from API
 */
export type PositionInfo = PoolInfo & {
  positionMargin: number;
  accountId: string;
};

/**
 * @dev Edit Swap flow inputs, provided by client (e.g. UI)
 */
export type EditSwapArgs = {
  poolId: string;
  positionId: string;
  signer: Signer;
  notionalAmount: number;
  marginAmount: number;
  priceLimit?: number; // e.g. 0.0125 = 1.25%
};
