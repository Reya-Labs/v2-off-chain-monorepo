import { Address, getApy } from '@voltz-protocol/commons-v2';
import { getLiquidityIndicesAt } from './getLiquidityIndicesAt';

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

  const [fromIndex, toIndex] = await getLiquidityIndicesAt(
    environmentV2Tag,
    chainId,
    rateOracle,
    [fromTimestamp, toTimestamp],
  );

  if (fromIndex === null || toIndex === null) {
    return null;
  }

  const apy = getApy(
    {
      index: fromIndex,
      timestamp: fromTimestamp,
    },
    {
      index: toIndex,
      timestamp: toTimestamp,
    },
    method,
  );

  return apy;
}
