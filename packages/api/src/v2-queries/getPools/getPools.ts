import {
  pullAllPoolsConfig,
  getApyFromTo,
  SECONDS_IN_HOUR,
} from '@voltz-protocol/commons-v2';

export const getPools = async () => {
  const pools = await pullAllPoolsConfig();

  const result: {
    chainId: number;
    marketId: string;
    maturityTimestamp: number;
    fixedRate: number | null;
    latestApy: number | null;
  }[] = [];

  for (const pool of pools) {
    const currentTimestamp = Math.round(Date.now() / 1000);
    // note leave 1h buffer -> can be configured depending on indexer frequency
    const latestApy = await getApyFromTo(
      pool.chainId,
      pool.rateOracle,
      currentTimestamp - 2 * SECONDS_IN_HOUR,
      currentTimestamp - 1 * SECONDS_IN_HOUR,
    );
    result.push({
      chainId: pool.chainId,
      marketId: pool.marketId,
      maturityTimestamp: pool.maturityTimestamp,
      fixedRate: pool.lastFixedRate,
      latestApy: latestApy,
    });
  }

  return result;
};
