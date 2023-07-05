import { BigNumber, ContractReceipt } from 'ethers';
import { EditLpArgs, InfoPostLp } from './types';
import { parseEditLpArgs } from './parseEditLpArgs';
import { commonEstimateLpGasUnits } from './commonEstimateLpGasUnits';
import { commonLp } from './commonLp';
import { commonSimulateLp } from './commonSimulateLp';

export async function editLp(args: EditLpArgs): Promise<ContractReceipt> {
  const params = await parseEditLpArgs(args);

  return commonLp(params);
}

export async function simulateEditLp(args: EditLpArgs): Promise<InfoPostLp> {
  const params = await parseEditLpArgs(args);

  return commonSimulateLp(params);
}

export async function estimateEditLpGasUnits(
  args: EditLpArgs,
): Promise<BigNumber> {
  const params = await parseEditLpArgs(args);

  return commonEstimateLpGasUnits(params);
}

export async function getEditLpInfo(
  args: Omit<EditLpArgs, 'margin'>,
): Promise<InfoPostLp> {
  return simulateEditLp({
    ...args,
    margin: 0,
  });
}
