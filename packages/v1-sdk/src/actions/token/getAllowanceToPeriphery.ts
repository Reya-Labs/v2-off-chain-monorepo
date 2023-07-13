import { GetAllowanceToPeripheryArgs } from '../types/actionArgTypes';
import { PERIPHERY_ADDRESS_BY_CHAIN_ID } from '../../common/constants';
import { getAmmInfo } from '../../common/api/amm/getAmmInfo';
import { AMMInfo } from '../../common/api/amm/types';
import { getERC20Allowance } from '@voltz-protocol/commons-v2';

export const getAllowanceToPeriphery = async ({
  ammId,
  signer,
}: GetAllowanceToPeripheryArgs): Promise<number> => {
  const chainId = await signer.getChainId();
  const ammInfo: AMMInfo = await getAmmInfo(ammId);
  const walletAddress: string = await signer.getAddress();

  if (ammInfo.isEth) {
    return Number.MAX_SAFE_INTEGER;
  }

  const peripheryAddress = PERIPHERY_ADDRESS_BY_CHAIN_ID[chainId];

  const descaledCappedAllowance = getERC20Allowance({
    walletAddress,
    tokenAddress: ammInfo.underlyingTokenAddress,
    spenderAddress: peripheryAddress,
    subject: signer,
  });

  return descaledCappedAllowance;
};
