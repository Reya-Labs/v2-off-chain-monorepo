import { BigNumber, ContractReceipt } from 'ethers';
import { InfoPostSwap, SwapArgs } from './types';
import { parseSwapArgs } from './parseSwapArgs';
import { commonSwap } from './commonSwap';
import { commonSimulateSwap } from './commonSimulateSwap';
import { commonEstimateSwapGasUnits } from './commonEstimateSwapGasUnits';

export async function swap(args: SwapArgs): Promise<ContractReceipt> {
  const params = await parseSwapArgs(args);

  return commonSwap(params);
}

export async function simulateSwap(args: SwapArgs): Promise<InfoPostSwap> {
  const params = await parseSwapArgs(args);

  return commonSimulateSwap(params);
}

export async function estimateSwapGasUnits(args: SwapArgs): Promise<BigNumber> {
  const params = await parseSwapArgs(args);

  return commonEstimateSwapGasUnits(params);
}

export async function getSwapInfo(
  args: Omit<SwapArgs, 'margin'>,
): Promise<InfoPostSwap> {
  return simulateSwap({
    ...args,
    margin: 0,
  });
}
