import md5 from 'crypto-js/md5';
import { BigNumber } from 'ethers';

type CreateAccountParams = {
  ownerAddress: string;
  productAddress: string;
  marketId: string;
  maturityTimestamp: number;
  isLp: boolean;
  priceLower?: number;
  priceUpper?: number;
};

// would be good to turn prices into ticks to decrease chances of collision
export async function createAccountId({
  ownerAddress,
  productAddress,
  marketId,
  maturityTimestamp,
  isLp,
  priceLower,
  priceUpper,
}: CreateAccountParams): Promise<string> {
  if (isLp && (priceLower === undefined || priceUpper === undefined)) {
    throw new Error('Account id error: LP missing range');
  }

  const message = ownerAddress
    .concat(productAddress)
    .concat(maturityTimestamp.toString())
    .concat(marketId)
    .concat(isLp ? `${priceLower}${priceUpper}` : 'taker')
    .concat('mvp');

  const hashedMessage = md5(message).toString();

  return BigNumber.from('0x' + hashedMessage).toString();
}

export function notionalToBaseAmount(
  notional: number,
  liquidityIndex: number,
): number {
  return notional / liquidityIndex;
}
