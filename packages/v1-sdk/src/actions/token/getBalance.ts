import { GetBalanceArgs } from '../types/actionArgTypes';
import { BigNumber } from 'ethers';
import { exponentialBackoff } from '../../common/retry';
import { getERC20TokenContract } from '../../common/contract-generators';
import { descale } from '../../common/math/descale';

export const getBalance = async ({
  isEth,
  tokenAddress,
  tokenDecimals,
  walletAddress,
  provider,
}: GetBalanceArgs) => {
  let currentBalance: BigNumber;
  if (isEth) {
    currentBalance = await exponentialBackoff(() =>
      provider.getBalance(walletAddress),
    );
  } else {
    const token = getERC20TokenContract(tokenAddress, provider);

    currentBalance = await exponentialBackoff(() =>
      token.balanceOf(walletAddress),
    );
  }

  return descale(currentBalance, tokenDecimals);
};
