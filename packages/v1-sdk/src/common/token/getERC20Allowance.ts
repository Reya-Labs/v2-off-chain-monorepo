import { providers } from 'ethers';
import { getERC20TokenContract } from '../contract-generators';
import { exponentialBackoff } from '../retry';
import { scale } from '../math/scale';
import { descale } from '../math/descale';

export type GetERC20AllowanceArgs = {
  walletAddress: string;
  tokenAddress: string;
  tokenDecimals: number;
  spenderAddress: string;
  provider: providers.Provider;
};

export const getERC20Allowance = async ({
  walletAddress,
  tokenAddress,
  tokenDecimals,
  spenderAddress,
  provider,
}: GetERC20AllowanceArgs): Promise<number> => {
  const tokenContract = getERC20TokenContract(tokenAddress, provider);

  const allowance = await exponentialBackoff(() =>
    tokenContract.allowance(walletAddress, spenderAddress),
  );

  let descaledCappedAllowance;
  if (allowance.gt(scale(Number.MAX_SAFE_INTEGER, tokenDecimals))) {
    descaledCappedAllowance = Number.MAX_SAFE_INTEGER;
  } else {
    descaledCappedAllowance = descale(allowance, tokenDecimals);
  }

  return descaledCappedAllowance;
};
