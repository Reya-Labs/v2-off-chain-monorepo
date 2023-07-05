import { RolloverWithLpArgs } from './types';
import { ContractReceipt } from 'ethers';
import { InfoPostLp } from '../newLp';

export async function rolloverWithLp(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  args: RolloverWithLpArgs,
): Promise<ContractReceipt> {
  throw new Error(`Not implemented yet`);
}

export async function simulateRolloverWithLp(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  args: RolloverWithLpArgs,
): Promise<InfoPostLp> {
  throw new Error(`Not implemented yet`);
}
