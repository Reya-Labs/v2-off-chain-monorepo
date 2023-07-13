import { getPoolInfo } from '../../gateway/getPoolInfo';
import { GetAllowanceToPeripheryArgs } from './types';
import { getAddress, getERC20Allowance } from '@voltz-protocol/commons-v2';

export const getAllowanceToPeriphery = async ({
  ammId,
  signer,
}: GetAllowanceToPeripheryArgs): Promise<number> => {
  const chainId = await signer.getChainId();
  const poolInfo = await getPoolInfo(ammId);

  if (poolInfo.chainId !== chainId) {
    throw new Error('Chain id mismatch between pool and signer');
  }

  const walletAddress: string = await signer.getAddress();
  const isETH = poolInfo.underlyingToken.priceUSD > 1;

  if (isETH) {
    return Number.MAX_SAFE_INTEGER;
  }

  const peripheryAddress = getAddress(chainId, 'periphery');

  const allowance = await getERC20Allowance({
    walletAddress,
    tokenAddress: poolInfo.underlyingToken.address,
    spenderAddress: peripheryAddress,
    subject: signer,
  });

  return allowance;
};
