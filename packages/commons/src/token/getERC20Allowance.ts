import { Signer, providers } from 'ethers';
import { exponentialBackoff } from '../retry';
import { descale } from './descale';
import { getERC20TokenContract } from './getERC20TokenContract';
import { scale } from './scale';
import { getTokenDetails } from './getTokenDetails';

export type GetERC20AllowanceArgs = {
  walletAddress: string;
  tokenAddress: string;
  spenderAddress: string;
  subject: providers.Provider | Signer;
};

export const getERC20Allowance = async ({
  walletAddress,
  tokenAddress,
  spenderAddress,
  subject,
}: GetERC20AllowanceArgs): Promise<number> => {
  const tokenContract = getERC20TokenContract(tokenAddress, subject);
  const { tokenDecimals } = getTokenDetails(tokenAddress);

  const allowance = await exponentialBackoff(() =>
    tokenContract.allowance(walletAddress, spenderAddress),
  );

  return allowance.gt(scale(tokenDecimals)(Number.MAX_SAFE_INTEGER))
    ? Number.MAX_SAFE_INTEGER
    : descale(tokenDecimals)(allowance);
};
