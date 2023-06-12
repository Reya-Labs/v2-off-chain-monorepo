import { Address, SECONDS_IN_YEAR } from '@voltz-protocol/commons-v2';
import { getLiquidityIndexAt } from './getLiquidityIndexAt';

export async function getApyFromTo(
  chainId: number,
  rateOracle: Address,
  fromTimestamp: number,
  toTimestamp: number,
): Promise<number | null> {
  if (fromTimestamp > toTimestamp) {
    throw new Error('Unordered timestamps');
  }

  const fromIndex = await getLiquidityIndexAt(
    chainId,
    rateOracle,
    fromTimestamp,
  );
  const toIndex = await getLiquidityIndexAt(chainId, rateOracle, toTimestamp);

  if (fromIndex === null || toIndex === null) {
    return null;
  }

  // todo: add flag (currently for compound oracles)
  const timeFactor = SECONDS_IN_YEAR / (toTimestamp - fromTimestamp);
  const apy = (toIndex / fromIndex) ** timeFactor - 1;
  // if linear
  /*
        const targetIndex = (toIndex - fromIndex) * timeFactor;
    */

  return apy * 100;
}
