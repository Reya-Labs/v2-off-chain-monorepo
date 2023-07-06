import { BigNumber, ContractReceipt } from 'ethers';
import { EditSwapArgs, InfoPostSwap } from './types';
import { parseEditSwapArgs } from './parseEditSwapArgs';
import { commonSwap } from './commonSwap';
import { commonSimulateSwap } from './commonSimulateSwap';
import { commonEstimateSwapGasUnits } from './commonEstimateSwapGasUnits';

export async function editSwap(args: EditSwapArgs): Promise<ContractReceipt> {
  const params = await parseEditSwapArgs(args);

  return commonSwap(params);
}

export async function simulateEditSwap(
  args: EditSwapArgs,
): Promise<InfoPostSwap> {
  const params = await parseEditSwapArgs(args);

  return commonSimulateSwap(params);
}

export async function estimateEditSwapGasUnits(
  args: EditSwapArgs,
): Promise<BigNumber> {
  const params = await parseEditSwapArgs(args);

  return commonEstimateSwapGasUnits(params);
}

export async function getEditSwapInfo(
  args: Omit<EditSwapArgs, 'margin'>,
): Promise<InfoPostSwap> {
  return simulateEditSwap({
    ...args,
    margin: 0,
  });
}
