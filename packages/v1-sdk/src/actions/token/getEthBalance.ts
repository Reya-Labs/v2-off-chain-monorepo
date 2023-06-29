import { providers } from 'ethers';
import { descale } from '../../common/math/descale';
import { NUMBER_OF_DECIMALS_ETHER } from '../../common/constants';
import { exponentialBackoff } from '@voltz-protocol/commons-v2';

export type GetEthBalanceArgs = {
  walletAddress: string;
  provider: providers.Provider;
};

export const getEthBalance = async ({
  walletAddress,
  provider,
}: GetEthBalanceArgs): Promise<number> => {
  const currentBalance = await exponentialBackoff(() =>
    provider.getBalance(walletAddress),
  );

  return descale(currentBalance, NUMBER_OF_DECIMALS_ETHER);
};
