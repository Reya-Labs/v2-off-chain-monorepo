/* eslint-disable @typescript-eslint/no-unsafe-call */

import { BigNumber } from 'ethers';

import { getProvider } from '../provider/getProvider';
import { generateVAMMContract } from './generateVAMMContract';

export const getCurrentTick = async (
  chainId: number,
  vammAddress: string,
  blockTag?: number,
): Promise<number> => {
  const provider = getProvider(chainId);
  const vammContract = generateVAMMContract(vammAddress, provider);

  const currentTick = (
    (await vammContract.vammVars({
      blockTag: blockTag,
    })) as [BigNumber, number, number]
  )[1];

  return currentTick;
};
