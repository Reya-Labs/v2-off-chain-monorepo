import { GetAllowanceArgs } from '../types/actionArgTypes';
import { getERC20TokenContract } from '../../common/contract-generators';
import { exponentialBackoff } from '../../common/retry';
import { PERIPHERY_ADDRESS_BY_CHAIN_ID } from '../../common/constants';
import { descale } from '../../common/math/descale';
import { scale } from '../../common/math/scale';

export const getAllowanceToPeriphery = async ({
  isEth,
  chainId,
  tokenAddress,
  tokenDecimals,
  walletAddress,
  provider,
}: GetAllowanceArgs): Promise<number> => {
  if (isEth) {
    return Number.MAX_SAFE_INTEGER;
  }

  const tokenContract = getERC20TokenContract(tokenAddress, provider);

  const peripheryAddress = PERIPHERY_ADDRESS_BY_CHAIN_ID[chainId];

  const allowance = await exponentialBackoff(() =>
    tokenContract.allowance(walletAddress, peripheryAddress),
  );

  let descaledCappedAllowance;
  if (allowance.gt(scale(Number.MAX_SAFE_INTEGER, tokenDecimals))) {
    descaledCappedAllowance = Number.MAX_SAFE_INTEGER;
  } else {
    descaledCappedAllowance = descale(allowance, tokenDecimals);
  }

  return descaledCappedAllowance;
};
