import { Signer } from 'ethers';
import { PoolConfig, PositionInfo } from '../../gateway/types';
import { SwapUserInputs } from '../swap';

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
 * @dev Edit Swap flow inputs, provided by client (e.g. UI)
 */
export type EditSwapArgs = {
  positionId: string;
  signer: Signer;
  notional: number;
  margin: number;
  fixedRateLimit?: number; // e.g. 0.0125 = 1.25%
};
