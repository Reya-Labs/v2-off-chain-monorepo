import { Address, getApy, isNull } from '@voltz-protocol/commons-v2';
import { getLiquidityIndexAt } from './getLiquidityIndexAt';

export async function getApyFromTo(
  environmentV2Tag: string,
  chainId: number,
  rateOracle: Address,
  fromTimestamp: number, // in seconds
  toTimestamp: number, // in seconds
  method: 'linear' | 'compounding' = 'compounding',
): Promise<number | null> {
  if (fromTimestamp > toTimestamp) {
    throw new Error(
      `Unordered timestamps when getting APY [${fromTimestamp} - ${toTimestamp}]`,
    );
  }

  if (fromTimestamp === toTimestamp) {
    return 0;
  }

  const fromIndex = await getLiquidityIndexAt(
    environmentV2Tag,
    chainId,
    rateOracle,
    fromTimestamp,
  );

  const toIndex = await getLiquidityIndexAt(
    environmentV2Tag,
    chainId,
    rateOracle,
    toTimestamp,
  );

  if (isNull(fromIndex) || isNull(toIndex)) {
    return null;
  }

  const apy = getApy(
    {
      index: fromIndex as number,
      timestamp: fromTimestamp,
    },
    {
      index: toIndex as number,
      timestamp: toTimestamp,
    },
    method,
  );

  return apy;
}
