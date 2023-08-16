/* eslint-disable @typescript-eslint/no-unused-vars */
export type WithdrawMarginArgs = {
  marginAccountId: string;
  amount: number;
  token: 'dai' | 'eth' | 'reth' | 'steth' | 'usdc' | 'usdt';
};

export const withdrawMargin = async ({
  marginAccountId,
  amount,
  token,
}: WithdrawMarginArgs): Promise<boolean> => {
  await new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 100 + 1000);
  });
  return true;
};
