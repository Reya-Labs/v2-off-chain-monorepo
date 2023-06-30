import { getPoolInfo } from '../../gateway/getPoolInfo';
import { getERC20Allowance } from '@voltz-protocol/sdk-v1-stateless';
import { GetAllowanceToPeripheryArgs } from './types';
import { getAddress } from '@voltz-protocol/commons-v2';

export const getAllowanceToPeriphery = async ({
  ammId,
  signer,
}: GetAllowanceToPeripheryArgs): Promise<number> => {
  if (signer.provider === undefined) {
    throw new Error('Signer must have a provider');
  }

  const chainId = await signer.getChainId();
  const poolInfo = await getPoolInfo(ammId);

  if (poolInfo.chainId !== chainId) {
    throw new Error('Chain id mismatch between pool and signer');
  }

  const walletAddress: string = await signer.getAddress();

  if (poolInfo.isETH) {
    return Number.MAX_SAFE_INTEGER;
  }

  const peripheryAddress = getAddress(chainId, 'periphery');

  const allowance = await getERC20Allowance({
    walletAddress,
    tokenAddress: poolInfo.quoteTokenAddress,
    tokenDecimals: poolInfo.quoteTokenDecimals,
    spenderAddress: peripheryAddress,
    provider: signer.provider,
  });

  return allowance;
};
