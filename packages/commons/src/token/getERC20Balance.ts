import { Signer, providers } from 'ethers';
import { exponentialBackoff } from '../retry';
import { getERC20TokenContract } from './getERC20TokenContract';
import { getTokenDetails } from './getTokenDetails';

export type GetERC20BalanceArgs = {
  tokenAddress: string;
  walletAddress: string;
  subject: providers.Provider | Signer;
};

export const getERC20Balance = async ({
  tokenAddress,
  walletAddress,
  subject,
}: GetERC20BalanceArgs): Promise<number> => {
  const token = getERC20TokenContract(tokenAddress, subject);

  const { tokenDescaler } = getTokenDetails(tokenAddress);

  const currentBalance = await exponentialBackoff(() =>
    token.balanceOf(walletAddress),
  );

  return tokenDescaler(currentBalance);
};
