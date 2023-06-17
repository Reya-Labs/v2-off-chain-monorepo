import { Signer } from 'ethers';
import { PoolConfig, PositionInfo } from '../../gateway/types';
import { LpUserInputs } from '../lp';

/**
 * @dev Full list of swap details
 */
export type CompleteEditLpDetails = PositionInfo & LpUserInputs;

/**
 * @dev Params required to encode periphery command
 */
export type EditLpPeripheryParameters = Required<PoolConfig & EditLpUserInputs>;

type EditLpUserInputs = LpUserInputs & {
  accountId: string;
};

/**
 * @dev Swap flow inputs, provided by client (e.g. UI)
 */
export type EditLpArgs = {
  positionId: string;
  signer: Signer;
  notional: number;
  margin: number;
};
