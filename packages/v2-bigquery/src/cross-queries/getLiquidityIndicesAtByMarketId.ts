import { getLiquidityIndicesAt } from '../tables';
import { pullMarketEntry } from '../tables/markets-table';

export const getLiquidityIndicesAtByMarketId = async (
  environmentV2Tag: string,
  chainId: number,
  marketId: string,
  targetTimestamps: number[],
): Promise<(number | null)[]> => {
  const market = await pullMarketEntry(environmentV2Tag, chainId, marketId);

  if (!market) {
    // todo: track
    console.log(`Couldn't find market for ${chainId}-${marketId}`);

    return targetTimestamps.map(() => null);
  }

  return getLiquidityIndicesAt(
    environmentV2Tag,
    chainId,
    market.oracleAddress,
    targetTimestamps,
  );
};
