import { BigNumberish } from 'ethers';

export const getSqrtPriceLimitFromFixedRateLimit = (
  fixedRate: number,
): BigNumberish => {
  const { closestUsableTick: tickLimit } =
    closestTickAndFixedRate(fixedRateLimit);
};
