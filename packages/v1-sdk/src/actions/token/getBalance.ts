import { GetBalanceArgs } from '../types/actionArgTypes';
import { AMMInfo } from '../../common/api/amm/types';
import { getAmmInfo } from '../../common/api/amm/getAmmInfo';
import { getEthBalance, getERC20Balance } from '@voltz-protocol/commons-v2';

export const getBalance = async ({
  ammId,
  signer,
}: GetBalanceArgs): Promise<number> => {
  const walletAddress = await signer.getAddress();
  const ammInfo: AMMInfo = await getAmmInfo(ammId);

  let currentBalance: number;
  if (ammInfo.isEth) {
    currentBalance = await getEthBalance(walletAddress, signer);
  } else {
    currentBalance = await getERC20Balance({
      tokenAddress: ammInfo.underlyingTokenAddress,
      walletAddress,
      subject: signer,
    });
  }

  return currentBalance;
};
