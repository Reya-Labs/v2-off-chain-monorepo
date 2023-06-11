import { GetBalanceArgs } from '../types/actionArgTypes';
import { exponentialBackoff } from '../../common/retry';
import { getERC20TokenContract } from '../../common/contract-generators';
import { getEthBalance } from './getEthBalance';

export const getBalance = async ({
  isEth,
  tokenAddress,
  tokenDecimals,
  walletAddress,
  provider,
}: GetBalanceArgs): Promise<number> => {
  let currentBalance: number;
  if (isEth) {
    currentBalance = await getEthBalance({ walletAddress, provider });
  } else {
    const token = getERC20TokenContract(tokenAddress, provider);

    currentBalance = await exponentialBackoff(() =>
      token.balanceOf(walletAddress),
    );
  }

  return currentBalance;
};
