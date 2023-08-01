import { IrsVammPoolEntry, pullMarketEntry } from '@voltz-protocol/bigquery-v2';
import {
  getTokenDetails,
  getTokenPriceInUSD,
  getAddress,
  SECONDS_IN_DAY,
  getMarketProtocolId,
  getProtocolName,
  isBorrowingProtocol,
  encodeV2PoolId,
} from '@voltz-protocol/commons-v2';
import { getFixedRateData } from './getFixedRateData';
import { getVariableRateData } from './getVariableRateData';
import { getCoingeckoApiKey, getEnvironmentV2 } from '../../services/envVars';
import { V2Pool } from '@voltz-protocol/api-sdk-v2';
import { log } from '../../logging/log';
import { isPoolBlacklisted } from '../../services/isPoolBlacklisted';

// configuration
const lookbackWindowSeconds = SECONDS_IN_DAY;

// todo: await multiple promises at once
// todo: pack more queries on SQL side

export const buildV2Pool = async ({
  chainId,
  marketId,
  maturityTimestamp,
  rateOracle,
  creationTimestamp,
  tickSpacing,
  currentTick,
}: IrsVammPoolEntry): Promise<V2Pool> => {
  const market = await pullMarketEntry(getEnvironmentV2(), chainId, marketId);

  if (!market) {
    throw new Error(
      `Pool does not have associated market entry (${chainId}-${marketId})`,
    );
  }

  const id = encodeV2PoolId({
    chainId,
    marketId,
    maturityTimestamp,
  });

  const { quoteToken, oracleAddress } = market;

  const tokenDetails = getTokenDetails(quoteToken);
  let tokenPriceUSD = 0;
  try {
    tokenPriceUSD = await getTokenPriceInUSD(
      tokenDetails.tokenName,
      getCoingeckoApiKey(),
    );
  } catch (error) {
    log((error as Error).message);
  }

  const { currentFixedRate, fixedRateChange } = await getFixedRateData(
    chainId,
    marketId,
    maturityTimestamp,
    currentTick,
    lookbackWindowSeconds,
  );

  const { currentLiquidityIndex, currentVariableRate, variableRateChange } =
    await getVariableRateData(chainId, rateOracle, lookbackWindowSeconds);

  const protocolId = getMarketProtocolId(marketId);
  const marketName = getProtocolName(protocolId);
  const isBorrowingMarket = isBorrowingProtocol(protocolId);

  return {
    id,
    chainId,

    marketId,
    makerFee: market.atomicMakerFee,
    takerFee: market.atomicTakerFee,

    termStartTimestampInMS: creationTimestamp * 1000,
    termEndTimestampInMS: maturityTimestamp * 1000,

    market: marketName,
    isBorrowing: isBorrowingMarket,

    currentFixedRate,
    fixedRateChange,

    currentLiquidityIndex,
    currentVariableRate,
    variableRateChange,
    rateChangeLookbackWindowMS: lookbackWindowSeconds * 1000,

    underlyingToken: {
      address: quoteToken,
      name: tokenDetails.tokenName.toLowerCase() as
        | 'eth'
        | 'usdc'
        | 'usdt'
        | 'dai',
      tokenDecimals: tokenDetails.tokenDecimals,
      priceUSD: tokenPriceUSD,
    },

    rateOracle: {
      address: oracleAddress,
      protocolId,
    },

    tickSpacing,

    coreAddress: getAddress(chainId, 'core'),
    productAddress: getAddress(chainId, 'dated_irs_instrument'),
    exchangeAddress: getAddress(chainId, 'dated_irs_vamm'),

    isV2: true,
    flags: {
      isGLP28Jun2023: false,
      isBlacklisted: isPoolBlacklisted(id),
      isPaused: false,
    },
  };
};
