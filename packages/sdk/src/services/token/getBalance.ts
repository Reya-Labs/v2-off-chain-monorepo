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
  const poolInfo = await getPoolInfo(ammId);

  const chainId = await signer.getChainId();
  if (poolInfo.chainId !== chainId) {
    throw new Error('Chain id mismatch between pool and signer');
  }

  let currentBalance: number;
  if (poolInfo.isETH) {
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
