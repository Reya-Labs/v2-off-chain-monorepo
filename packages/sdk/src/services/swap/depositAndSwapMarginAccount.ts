/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  DepositAndSwapMarginAccountArgs,
  SimulateDepositAndSwapMarginAccountResult,
} from './types';

// return type should be ContractReceipt
export async function depositAndSwapMarginAccount(
  args: DepositAndSwapMarginAccountArgs,
): Promise<{
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

function mockSimulateDepositAndSwapMarginAccountResult(): SimulateDepositAndSwapMarginAccountResult {
  const randomValue = () => Math.random() * 1000;

  return {
    accountInitialMarginPostTrade: randomValue(),
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

export async function simulateDepositAndSwapMarginAccount(
  args: DepositAndSwapMarginAccountArgs,
): Promise<SimulateDepositAndSwapMarginAccountResult> {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      const num = Math.random() * 100;
      if (num > 50) {
        reject(new Error('Random error happened. Chance is 50-50 try again!'));
        return;
      }

      resolve(mockSimulateDepositAndSwapMarginAccountResult());
    }, Math.random() * 100 + 1000);
  });
}
