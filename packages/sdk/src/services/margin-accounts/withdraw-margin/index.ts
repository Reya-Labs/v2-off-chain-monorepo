/* eslint-disable @typescript-eslint/no-unused-vars */

export type WithdrawMarginArgs = {
  marginAccountId: string;
  amount: number;
  token: 'dai' | 'eth' | 'reth' | 'steth' | 'usdc' | 'usdt';
};

// return type should be ContractReceipt
export const withdrawMargin = async ({
  marginAccountId,
  amount,
  token,
}: WithdrawMarginArgs): Promise<{
  transactionHash: string;
}> => {
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
};
