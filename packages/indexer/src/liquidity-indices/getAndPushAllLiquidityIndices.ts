import { pullRateOracleEntries } from '@voltz-protocol/bigquery-v2';
import { SupportedChainId } from '@voltz-protocol/commons-v2';
import { getAndPushLiquidityIndex } from './getAndPushLiquidityIndex';
import { getProvider } from '../services/getProvider';

export const getAndPushAllLiquidityIndices = async (): Promise<void> => {
  const oracles = await pullRateOracleEntries();
  const cachedBlockNumbers: { [chainId: string]: [number, number] } = {};

  const getWhen = async (
    chainId: SupportedChainId,
  ): Promise<[number, number]> => {
    const cacheKey = chainId.toString();

    if (!Object.keys(cachedBlockNumbers).includes(cacheKey)) {
      const provider = getProvider(chainId);

      const { number: blockNumber, timestamp: blockTimestamp } =
        await provider.getBlock('latest');

      cachedBlockNumbers[cacheKey] = [blockNumber, blockTimestamp];
    }

    return cachedBlockNumbers[cacheKey];
  };

  for (const { chainId, oracleAddress } of oracles) {
    const [blockNumber, blockTimestamp] = await getWhen(chainId);

    await getAndPushLiquidityIndex(
      chainId,
      oracleAddress,
      blockNumber,
      blockTimestamp,
    );
  }
};
