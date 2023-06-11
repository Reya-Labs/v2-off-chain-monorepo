import { GetBalanceArgs } from '../types/actionArgTypes';
import { getERC20TokenContract } from '../../common/contract-generators';
import { getEthBalance } from './getEthBalance';
import { getERC20Balance } from './getERC20Balance';

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
    currentBalance = await getERC20Balance({
      walletAddress,
      provider,
      tokenAddress,
      tokenDecimals,
    });
  }

  return currentBalance;
};
