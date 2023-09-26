/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  SimulateSwapMarginAccountResult,
  SwapMarginAccountArgs,
} from './types';

// return type should be ContractReceipt
export async function swapMarginAccount(args: SwapMarginAccountArgs): Promise<{
  transactionHash: string;
}> {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      const num = Math.random() * 100;
      if (num > 50) {
        reject(new Error('Random error happened. Chance is 50-50 try again!'));
        return;
      }

      resolve({
        transactionHash:
          '0x4a7c0f392bd3e3423d1e7e972d5f3a83ae9c3bbf8a2a3f6a53f57f0825c3a8d7',
      });
    }, Math.random() * 100 + 1000);
  });
}

function mockSimulateSwapMarginAccountResult(): SimulateSwapMarginAccountResult {
  const randomValue = () => Math.random() * 1000;

  return {
    marginRequirement: randomValue(),
    maxMarginWithdrawable: randomValue(),
    fee: randomValue(),
    averageFixedRate: randomValue(),
    variableTokenDeltaBalance: randomValue(),
    gasFee: {
      value: randomValue(),
      token:
        Math.random() < 0.33 ? 'ETH' : Math.random() < 0.66 ? 'AVAX' : 'USDCf',
    },
  };
}

export async function simulateSwapMarginAccount(
  args: SwapMarginAccountArgs,
): Promise<SimulateSwapMarginAccountResult> {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      const num = Math.random() * 100;
      if (num > 50) {
        reject(new Error('Random error happened. Chance is 50-50 try again!'));
        return;
      }

      resolve(mockSimulateSwapMarginAccountResult());
    }, Math.random() * 100 + 1000);
  });
}
