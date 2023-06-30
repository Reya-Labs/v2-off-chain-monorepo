import { RolloverWithSwapArgs } from './types';
import { ContractReceipt } from 'ethers';
import { InfoPostSwap } from '../swap';

export async function rolloverWithSwap(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  args: RolloverWithSwapArgs,
): Promise<ContractReceipt> {
  throw new Error(`Not implemented yet`);
}

export async function simulateRolloverWithSwap(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  args: RolloverWithSwapArgs,
): Promise<InfoPostSwap> {
  throw new Error(`Not implemented yet`);
}
