import { getERC20TokenContract } from '../../common/contract-generators';
import { exponentialBackoff } from '../../common/retry';
import { descale } from '../../common/math/descale';
import { providers } from 'ethers';

export type GetERC20BalanceArgs = {
  walletAddress: string;
  provider: providers.Provider;
  tokenAddress: string;
  tokenDecimals: number;
};

export const getERC20Balance = async ({
  walletAddress,
  provider,
  tokenAddress,
  tokenDecimals,
}: GetERC20BalanceArgs): Promise<number> => {
  const token = getERC20TokenContract(tokenAddress, provider);

  const currentBalance = await exponentialBackoff(() =>
    token.balanceOf(walletAddress),
  );

  return descale(currentBalance, tokenDecimals);
};
