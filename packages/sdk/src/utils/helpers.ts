import md5 from 'crypto-js/md5';
import { BigNumber, utils } from 'ethers';
import { BaseTrade } from './types';
import { getTokenInfo } from './constants';

// would be good to turn prices into ticks to decrease chances of collision
export async function createAccountId(
  trade: BaseTrade,
  isLp?: boolean,
  priceLower?: number,
  priceUpper?: number,
): Promise<string> {
  const userAddress = await trade.owner.getAddress();

  const message = userAddress
    .concat(trade.productAddress)
    .concat(trade.maturityTimestamp.toString())
    .concat(trade.marketId)
    .concat(isLp ? `${priceLower}${priceUpper}` : 'taker')
    .concat('mvp');

  const hashedMessage = md5(message).toString();

  return BigNumber.from('0x' + hashedMessage).toString();
}

export function scaleAmount(
  value: number,
  underlyingTokenAddress: string,
): string {
  const decimals = getTokenInfo(underlyingTokenAddress).decimals;
  return utils.parseUnits(value.toFixed(decimals), decimals).toString();
}
