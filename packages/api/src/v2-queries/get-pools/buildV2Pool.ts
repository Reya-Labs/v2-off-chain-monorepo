import { VammCreatedEvent, pullMarketEntry } from '@voltz-protocol/bigquery-v2';
import { V2Pool } from './types';
import {
  getTokenDetails,
  getTokenPriceInUSD,
  getAddress,
  SECONDS_IN_DAY,
  getMarketProtocolId,
  getProtocolName,
  isBorrowingProtocol,
} from '@voltz-protocol/commons-v2';
import { getFixedRateData } from './getFixedRateData';
import { getVariableRateData } from './getVariableRateData';
import { encodeV2PoolId } from './v2PoolId';

// configuration
const lookbackWindowSeconds = SECONDS_IN_DAY;

// todo: use Promise.allSettled()
// todo: pack more queries on SQL side

export const buildV2Pool = async ({
  chainId,
  marketId,
  maturityTimestamp,
  rateOracle,
  blockTimestamp,
  tickSpacing,
}: VammCreatedEvent): Promise<V2Pool> => {
  const market = await pullMarketEntry(chainId, marketId);

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
  const tokenPriceUSD = await getTokenPriceInUSD(tokenDetails.tokenName);

  const { currentFixedRate, fixedRateChange } = await getFixedRateData(
    chainId,
    marketId,
    maturityTimestamp,
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

    termStartTimestampInMS: blockTimestamp,
    termEndTimestampInMS: maturityTimestamp,

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
  };
};