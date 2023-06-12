import { GetAllowanceArgs } from '../types/actionArgTypes';
import { PERIPHERY_ADDRESS_BY_CHAIN_ID } from '../../common/constants';
import { getAmmInfo } from '../../common/api/amm/getAmmInfo';
import { AMMInfo } from '../../common/api/amm/types';
import { getERC20Allowance } from '../../common/token/getERC20Allowance';

export const getAllowanceToPeriphery = async ({
  ammId,
  signer,
}: GetAllowanceArgs): Promise<number> => {
  if (signer.provider === undefined) {
    throw new Error('Signer must have a provider');
  }

  const chainId = await signer.getChainId();
  const ammInfo: AMMInfo = await getAmmInfo(ammId, chainId);
  const walletAddress: string = await signer.getAddress();

  if (ammInfo.isEth) {
    return Number.MAX_SAFE_INTEGER;
  }

  const peripheryAddress = PERIPHERY_ADDRESS_BY_CHAIN_ID[chainId];

  const descaledCappedAllowance = getERC20Allowance({
    walletAddress,
    tokenAddress: ammInfo.underlyingTokenAddress,
    tokenDecimals: ammInfo.underlyingTokenDecimals,
    spenderAddress: peripheryAddress,
    provider: signer.provider,
  });

  return descaledCappedAllowance;
};
