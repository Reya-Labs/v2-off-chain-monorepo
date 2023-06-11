import { GetBalanceArgs } from '../types/actionArgTypes';
import { getEthBalance } from './getEthBalance';
import { getERC20Balance } from './getERC20Balance';
import { AMMInfo } from '../../common/api/amm/types';
import { getAmmInfo } from '../../common/api/amm/getAmmInfo';

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
  const ammInfo: AMMInfo = await getAmmInfo(ammId, chainId);

  let currentBalance: number;
  if (ammInfo.isEth) {
    currentBalance = await getEthBalance({ walletAddress, provider });
  } else {
    currentBalance = await getERC20Balance({
      walletAddress,
      provider,
      tokenAddress: ammInfo.underlyingTokenAddress,
      tokenDecimals: ammInfo.underlyingTokenDecimals,
    });
  }

  return currentBalance;
};
