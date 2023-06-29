import md5 from 'crypto-js/md5';
import { BigNumber, ethers } from 'ethers';
import { RAY } from './constants';
import { fixedRateToPrice } from './math/tickHelpers';

type CreateAccountParams = {
  ownerAddress: string;
  productAddress: string;
  marketId: string;
  maturityTimestamp: number;
  isLp: boolean;
  tickLower?: number;
  tickUpper?: number;
};

// would be good to turn prices into ticks to decrease chances of collision
export async function createAccountId({
  ownerAddress,
  productAddress,
  marketId,
  maturityTimestamp,
  isLp,
  tickLower,
  tickUpper,
}: CreateAccountParams): Promise<string> {
  if (isLp && (tickLower === undefined || tickUpper === undefined)) {
    throw new Error('Account id error: LP missing range');
  }

  const message = `${ownerAddress}_${productAddress}_${maturityTimestamp}_${marketId}_${
    isLp ? `${tickLower}_${tickUpper}` : 'taker'
  }_mvp`;

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

  return notionalAmount
    .mul(BigNumber.from(2).pow(96))
    .div(sqrtPriceDelta.abs());
}

export const descale = (tokenDecimals: number) => {
  const f = (value: ethers.BigNumber) => {
    return Number(ethers.utils.formatUnits(value.toString(), tokenDecimals));
  };

  return f;
};

export const scale = (tokenDecimals: number) => {
  const f = (value: number) => {
    return ethers.BigNumber.from(
      ethers.utils.parseUnits(value.toString(), tokenDecimals),
    );
  };

  return f;
};
