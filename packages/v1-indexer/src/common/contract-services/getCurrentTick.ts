/* eslint-disable @typescript-eslint/no-unsafe-call */

import { getProvider } from '../provider/getProvider';
import { generateVAMMContract } from './generateVAMMContract';

export const getCurrentTick = async (
  chainId: number,
  vammAddress: string,
  blockTag: number | undefined = undefined,
): Promise<number> => {
  const provider = getProvider(chainId);
  const vammContract = generateVAMMContract(vammAddress, provider);

  const currentTick = (
    await vammContract.vammVars({
      blockTag,
    })
  )[1] as number;

  return currentTick;
};
