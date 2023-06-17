import { scale } from '@voltz-protocol/commons-v2';
import md5 from 'crypto-js/md5';
import { BigNumber } from 'ethers';
import { RAY } from './constants';
import { Q96 } from './math/constants';
import { fixedRateToPrice } from './math/tickHelpers';

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
  tokenDecilams: number,
  liquidityIndex: number,
): BigNumber {
  return scale(tokenDecilams)(notional).mul(RAY).div(scale(27)(liquidityIndex));
}

export function baseAmountToNotionalBN(
  baseAmount: BigNumber,
  liquidityIndex: number,
): BigNumber {
  return baseAmount.mul(scale(27)(liquidityIndex)).div(RAY);
}

export function notionalToLiquidityBN(
  notionalAmount: BigNumber,
  fixedRateLower: number,
  fixedRateUpper: number,
): BigNumber {
  const sqrtPriceDelta = BigNumber.from(fixedRateToPrice(fixedRateLower)).sub(
    fixedRateToPrice(fixedRateUpper),
  );

  return notionalAmount.mul(BigNumber.from(Q96)).div(sqrtPriceDelta.abs());
}
