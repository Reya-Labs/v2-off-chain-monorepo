import { AvailableAmountToWithdrawForMarginAccount } from './types';

export function generateRandomMockResponse() {
  const tokenData = ['dai', 'eth', 'reth', 'steth', 'usdc', 'usdt'];

  const minNumTokens = 1;
  const maxNumTokens = tokenData.length;

  const numTokens =
    Math.floor(Math.random() * (maxNumTokens - minNumTokens + 1)) +
    minNumTokens;

  const minRandomValue = 1000;
  const maxRandomValue = 1000000;

  const shuffledTokens = tokenData.sort(() => 0.5 - Math.random());
  const randomTokens = shuffledTokens.slice(0, numTokens);

  return randomTokens.map((token) => {
    const value =
      Math.floor(Math.random() * (maxRandomValue - minRandomValue + 1)) +
      minRandomValue;
    const valueUSD = value * 12.3;
    return {
      token,
      value,
      valueUSD,
    };
  }) as AvailableAmountToWithdrawForMarginAccount[];
}
