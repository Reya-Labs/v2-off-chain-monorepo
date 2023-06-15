import {
  getTokenPriceInUSD,
  isBorrowingProtocol,
  getProtocolName,
} from '@voltz-protocol/commons-v2';
import { BigQueryPoolRow } from '@voltz-protocol/indexer-v1';
import { V1Pool } from './types';

export const buildV1Pool = async (
  rawPool: BigQueryPoolRow,
): Promise<V1Pool> => {
  const tokenName = rawPool.tokenName;
  const tokenPriceUSD = await getTokenPriceInUSD(tokenName);

  const pool: V1Pool = {
    id: rawPool.vamm,
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
