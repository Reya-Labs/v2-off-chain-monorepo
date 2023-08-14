import {
  getTokenPriceInUSD,
  isBorrowingProtocol,
  getProtocolName,
  encodeV1PoolId,
  convertToAddress,
} from '@voltz-protocol/commons-v2';
import { BigQueryPoolRow, getVammPaused } from '@voltz-protocol/indexer-v1';
import { getCoingeckoApiKey } from '../../services/envVars';
import { V1Pool } from '@voltz-protocol/api-sdk-v2';
import { log } from '../../logging/log';
import { isPoolBlacklisted } from '../../services/isPoolBlacklisted';
import { isSettementAllowedWhenPaused } from '../../services/isSettementAllowedWhenPaused';

export const buildV1Pool = async (
  rawPool: BigQueryPoolRow,
): Promise<V1Pool> => {
  const tokenName = rawPool.tokenName;

  let tokenPriceUSD = 0;
  try {
    tokenPriceUSD = await getTokenPriceInUSD(tokenName, getCoingeckoApiKey());
  } catch (error) {
    log((error as Error).message);
  }

  const id = encodeV1PoolId({
    chainId: rawPool.chainId,
    vammAddress: convertToAddress(rawPool.vamm),
  });

  const isPaused = await getVammPaused(rawPool.chainId, rawPool.vamm);

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

    flags: {
      isGLP28Jun2023:
        id === '42161_0x22393f23f16925d282aeca0a8464dccaf10ee480_v1',
      isBlacklisted: isPoolBlacklisted(id),
      isPaused,
      isSettementAllowedWhenPaused: isSettementAllowedWhenPaused(id),
    },
  };

  return pool;
};
