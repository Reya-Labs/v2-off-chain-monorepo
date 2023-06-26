import {
  getTokenPriceInUSD,
  isBorrowingProtocol,
  getProtocolName,
  encodeV1PoolId,
} from '@voltz-protocol/commons-v2';
import { BigQueryPoolRow } from '@voltz-protocol/indexer-v1';
import { getCoingeckoApiKey } from '../../services/envVars';
import { V1Pool } from '@voltz-protocol/api-v2-types';

export const buildV1Pool = async (
  rawPool: BigQueryPoolRow,
): Promise<V1Pool> => {
  const tokenName = rawPool.tokenName;
  const tokenPriceUSD = await getTokenPriceInUSD(
    tokenName,
    getCoingeckoApiKey(),
  );

  const id = encodeV1PoolId({
    chainId: rawPool.chainId,
    vammAddress: rawPool.vamm,
  });

  const pool: V1Pool = {
    id,
    chainId: rawPool.chainId,

    vamm: rawPool.vamm,
    marginEngineAddress: rawPool.marginEngine,
    tickSpacing: rawPool.tickSpacing,

    isBorrowing: isBorrowingProtocol(rawPool.protocolId),
    market: getProtocolName(rawPool.protocolId),

    rateOracle: {
      address: rawPool.rateOracle,
      protocolId: rawPool.protocolId,
    },

    underlyingToken: {
      address: rawPool.tokenId,
      name: tokenName.toLowerCase() as 'eth' | 'usdc' | 'usdt' | 'dai',
      tokenDecimals: rawPool.tokenDecimals,
      priceUSD: tokenPriceUSD,
    },

    termStartTimestampInMS: rawPool.termStartTimestampInMS,
    termEndTimestampInMS: rawPool.termEndTimestampInMS,

    isV2: false,
  };

  return pool;
};
