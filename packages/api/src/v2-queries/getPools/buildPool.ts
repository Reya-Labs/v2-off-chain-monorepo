import { VammCreatedEvent, pullMarketEntry } from '@voltz-protocol/bigquery-v2';
import { V2Pool } from './types';
import {
  getTokenDetails,
  getTokenPriceInUSD,
  getAddress,
  SECONDS_IN_DAY,
} from '@voltz-protocol/commons-v2';
import { getFixedRateData } from './getFixedRateData';
import { getVariableRateData } from './getVariableRateData';
import { encodeV2PoolId } from './v2PoolId';

// configuration
const lookbackWindowSeconds = SECONDS_IN_DAY;

// todo: use Promise.allSettled()
// todo: pack more queries on SQL side

export const buildPool = async ({
  chainId,
  marketId,
  maturityTimestamp,
  rateOracle,
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

  return {
    id,
    chainId,
    marketId,
    maturityTimestamp,

    oracleAddress,

    currentFixedRate,
    fixedRateChange,

    currentLiquidityIndex,
    currentVariableRate,
    variableRateChange,
    rateChangeLookbackWindowMS: lookbackWindowSeconds * 1000,

    tokenName: tokenDetails.tokenName,
    tokenDecimals: tokenDetails.tokenDecimals,
    tokenAddress: quoteToken,
    tokenPriceUSD,

    coreAddress: getAddress(chainId, 'core'),
    productAddress: getAddress(chainId, 'dated_irs_instrument'),
    exchangeAddress: getAddress(chainId, 'dated_irs_vamm'),
  };
};
