import { getPoolInfo } from '../../gateway/getPoolInfo';
import { GetBalanceArgs } from './types';
import {
  getEthBalance,
  getERC20Balance,
} from '@voltz-protocol/sdk-v1-stateless';

export const getBalance = async ({
  ammId,
  signer,
}: GetBalanceArgs): Promise<number> => {
  if (signer.provider === undefined) {
    throw new Error('Signer provider not found');
  }

  const walletAddress = await signer.getAddress();
  const provider = signer.provider;
  const chainId: number = await signer.getChainId();
  const poolInfo = await getPoolInfo(ammId);

  let currentBalance: number;
  if (poolInfo.isEth) {
    currentBalance = await getEthBalance({ walletAddress, provider });
  } else {
    currentBalance = await getERC20Balance({
      walletAddress,
      provider,
      tokenAddress: poolInfo.quoteTokenAddress,
      tokenDecimals: poolInfo.quoteTokenDecimals,
    });
  }

  return currentBalance;
};
