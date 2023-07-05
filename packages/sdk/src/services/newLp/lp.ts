import { BigNumber, ContractReceipt } from 'ethers';
import { InfoPostLp, LpArgs } from './types';
import { parseLpArgs } from './parseLpArgs';
import { commonEstimateLpGasUnits } from './commonEstimateLpGasUnits';
import { commonLp } from './commonLp';
import { commonSimulateLp } from './commonSimulateLp';

export async function lp(args: LpArgs): Promise<ContractReceipt> {
  const params = await parseLpArgs(args);

  return commonLp(params);
}

export async function simulateLp(args: LpArgs): Promise<InfoPostLp> {
  const params = await parseLpArgs(args);

  return commonSimulateLp(params);
}

export async function estimateLpGasUnits(args: LpArgs): Promise<BigNumber> {
  const params = await parseLpArgs(args);

  return commonEstimateLpGasUnits(params);
}

export async function getLpInfo(
  args: Omit<LpArgs, 'margin'>,
): Promise<InfoPostLp> {
  return simulateLp({
    ...args,
    margin: 0,
  });
}
