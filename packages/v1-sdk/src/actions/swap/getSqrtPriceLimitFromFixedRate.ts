import { BigNumberish } from 'ethers';

export const getSqrtPriceLimitFromFixedRateLimit = (
  fixedRateLimit: number,
): BigNumberish => {
  const { closestUsableTick: tickLimit } =
    closestTickAndFixedRate(fixedRateLimit);
};
