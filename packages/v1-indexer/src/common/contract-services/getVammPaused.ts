/* eslint-disable @typescript-eslint/no-unsafe-call */

import { getProvider } from '../provider/getProvider';
import { generateVAMMContract } from './generateVAMMContract';

export const getVammPaused = async (
  chainId: number,
  vammAddress: string,
  blockTag: number | undefined = undefined,
): Promise<boolean> => {
  const provider = getProvider(chainId);
  const vammContract = generateVAMMContract(vammAddress, provider);

  const isPaused = (await vammContract.paused({
    blockTag,
  })) as boolean;

  return isPaused;
};
