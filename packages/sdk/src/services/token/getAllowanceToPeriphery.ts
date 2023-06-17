import { getPoolInfo } from '../../gateway/getPoolInfo';
import { PERIPHERY_ADDRESS } from '../../utils/configuration';
import { getERC20Allowance } from '@voltz-protocol/sdk-v1-stateless';
import { GetAllowanceArgs } from './types';

export const getAllowanceToPeriphery = async ({
  ammId,
  signer,
}: GetAllowanceArgs): Promise<number> => {
  if (signer.provider === undefined) {
    throw new Error('Signer must have a provider');
  }

  const chainId = await signer.getChainId();
  const poolInfo = await getPoolInfo(ammId);
  const walletAddress: string = await signer.getAddress();

  if (poolInfo.isETH) {
    return Number.MAX_SAFE_INTEGER;
  }

  const peripheryAddress = PERIPHERY_ADDRESS(chainId);

  const descaledCappedAllowance = getERC20Allowance({
    walletAddress,
    tokenAddress: poolInfo.quoteTokenAddress,
    tokenDecimals: poolInfo.quoteTokenDecimals,
    spenderAddress: peripheryAddress,
    provider: signer.provider,
  });

  return descaledCappedAllowance;
};
