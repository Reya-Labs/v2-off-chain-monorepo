import { getERC20Balance, getEthBalance } from '@voltz-protocol/commons-v2';
import { GetBalanceArgs } from './types';
import { getPool } from '@voltz-protocol/api-sdk-v2';

export const getBalance = async ({
  ammId,
  signer,
}: GetBalanceArgs): Promise<number> => {
  const walletAddress = await signer.getAddress();
  const poolInfo = await getPool(ammId);

  const chainId = await signer.getChainId();
  if (poolInfo.chainId !== chainId) {
    throw new Error('Chain id mismatch between pool and signer');
  }

  const isETH = poolInfo.underlyingToken.priceUSD > 1;

  let currentBalance: number;
  if (isETH) {
    currentBalance = await getEthBalance(walletAddress, signer);
  } else {
    currentBalance = await getERC20Balance({
      walletAddress,
      subject: signer,
      tokenAddress: poolInfo.underlyingToken.address,
    });
  }

  return currentBalance;
};
