/* eslint-disable @typescript-eslint/no-unused-vars */
export type DepositMarginArgs = {
  marginAccountId: string;
  amount: number;
  token: 'dai' | 'eth' | 'reth' | 'steth' | 'usdc' | 'usdt';
};

export const depositMargin = async ({
  marginAccountId,
  amount,
  token,
}: DepositMarginArgs): Promise<boolean> => {
  await new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 100 + 1000);
  });
  return true;
};
