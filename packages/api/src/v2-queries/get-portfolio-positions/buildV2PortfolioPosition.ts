import {
  tickToFixedRate,
  getTimestampInSeconds,
  convertToAddress,
  computeRealizedPnL,
  computeTotalPnLIfFullUnwind,
  getDeltasFromLiquidity,
  getV2MarginRequirements,
} from '@voltz-protocol/commons-v2';

import {
  PositionEntry,
  getLiquidityIndicesAt,
  pullAccountCollateral,
  pullAccountEntry,
} from '@voltz-protocol/bigquery-v2';
import { getV2Pool } from '../get-pools/getV2Pool';
import { V2PortfolioPosition } from '@voltz-protocol/api-sdk-v2';
import { getEnvironmentV2 } from '../../services/envVars';
import { getProvider } from '../../services/getProvider';

export const buildV2PortfolioPosition = async ({
  chainId,
  id: positionId,
  accountId,
  marketId,
  maturityTimestamp,
  type: positionType,
  base,
  freeQuote,
  timeDependentQuote,
  lockedFixedRate: fixedRateLocked,
  liquidity,
  paidFees,
  tickLower,
  tickUpper,
  creationTimestamp,
}: PositionEntry): Promise<V2PortfolioPosition> => {
  const environmentTag = getEnvironmentV2();

  // Get account-level information

  const account = await pullAccountEntry(environmentTag, chainId, accountId);

  if (!account) {
    throw new Error(`Couldn't fetch account for ${chainId}-${accountId}`);
  }

  const ownerAddress = account.owner;

  const accountCollaterals = await pullAccountCollateral(
    environmentTag,
    chainId,
    accountId,
  );

  if (accountCollaterals.length === 0) {
    throw new Error(`Couldn't find position`);
  }

  const { balance: margin } = accountCollaterals[0];

  // Get pool-level information
  const pool = await getV2Pool(chainId, marketId, maturityTimestamp);

  if (!pool) {
    throw new Error(
      `Pool ${chainId}-${marketId}-${maturityTimestamp} was not found.`,
    );
  }

  const quoteToken = convertToAddress(pool.underlyingToken.address);

  // Get position-level information

  const fixLow = tickToFixedRate(tickUpper);
  const fixHigh = tickToFixedRate(tickLower);

  const notionalTraded = base * pool.currentLiquidityIndex;

  let notionalProvided = 0;
  if (positionType === 'lp') {
    const { x } = getDeltasFromLiquidity(liquidity, tickLower, tickUpper);
    notionalProvided = x * pool.currentLiquidityIndex;
  }

  const notional =
    positionType === 'lp' ? notionalProvided : Math.abs(notionalTraded);

  const type =
    positionType === 'lp' ? 'LP' : notionalTraded < 0 ? 'Fixed' : 'Variable';

  const isPoolMatured = maturityTimestamp <= getTimestampInSeconds();

  // todo: case when position is settled

  if (isPoolMatured) {
    const poolFixedRate = pool.currentFixedRate;

    const [liquidityIndexAtMaturity] = await getLiquidityIndicesAt(
      environmentTag,
      chainId,
      convertToAddress(pool.rateOracle.address),
      [maturityTimestamp],
    );

    if (!liquidityIndexAtMaturity) {
      throw new Error(
        `Couldn't fetch maturity liquidity index for ${chainId} - ${pool.rateOracle.address}`,
      );
    }

    // PnL
    const realizedPNLFees = -paidFees;

    const realizedPNLCashflow = computeRealizedPnL({
      base,
      timeDependentQuote,
      freeQuote,
      queryTimestamp: maturityTimestamp,
      liquidityIndexAtQuery: liquidityIndexAtMaturity,
    });

    // Build response
    return {
      id: positionId,
      accountId,
      ownerAddress,
      type,
      creationTimestampInMS: creationTimestamp * 1000,
      tickLower,
      tickUpper,
      fixLow,
      fixHigh,
      notionalProvided,
      notionalTraded,
      notional,
      margin,
      maxWithdrawableMargin: margin,
      liquidationThreshold: 0,
      safetyThreshold: 0,
      health: 'healthy',
      variant: 'matured',
      receiving: 0,
      paying: 0,
      unrealizedPNL: 0,
      realizedPNLFees,
      realizedPNLCashflow,
      settlementCashflow: realizedPNLCashflow,
      realizedPNLTotal: realizedPNLCashflow + realizedPNLFees,
      poolCurrentFixedRate: poolFixedRate,
      pool,
    };
  }

  const poolFixedRate = pool.currentFixedRate;
  const poolVariableRate = pool.currentVariableRate;

  const { liquidationThreshold, safetyThreshold } =
    await getV2MarginRequirements({
      accountId,
      collateralType: quoteToken,
      chainId,
      subject: getProvider(chainId),
    });

  const maxWithdrawableMargin = Math.max(margin - safetyThreshold, 0);

  const health =
    margin < liquidationThreshold
      ? 'danger'
      : margin < safetyThreshold
      ? 'warning'
      : 'healthy';

  // PnL
  const queryTimestamp = getTimestampInSeconds();

  const realizedPNLFees = -paidFees;

  const realizedPNLCashflow = computeRealizedPnL({
    base,
    timeDependentQuote,
    freeQuote,
    queryTimestamp,
    liquidityIndexAtQuery: pool.currentLiquidityIndex,
  });

  const totalPnLIfFullUnwind = computeTotalPnLIfFullUnwind({
    base,
    timeDependentQuote,
    freeQuote,
    queryTimestamp,
    queryLiquidityIndex: pool.currentLiquidityIndex,
    queryFixedRate: poolFixedRate,
    maturityTimestamp,
  });

  // Build response
  return {
    id: positionId,
    accountId,
    ownerAddress,
    type,
    creationTimestampInMS: creationTimestamp * 1000,
    tickLower,
    tickUpper,
    fixLow,
    fixHigh,
    notionalProvided,
    notionalTraded,
    notional,
    margin,
    maxWithdrawableMargin,
    liquidationThreshold,
    safetyThreshold,
    health,
    variant: 'active',
    receiving: notionalTraded < 0 ? fixedRateLocked : poolVariableRate,
    paying: notionalTraded < 0 ? poolVariableRate : fixedRateLocked,
    unrealizedPNL: totalPnLIfFullUnwind - realizedPNLCashflow,
    realizedPNLFees,
    realizedPNLCashflow,
    settlementCashflow: realizedPNLCashflow,
    realizedPNLTotal: realizedPNLCashflow + realizedPNLFees,
    poolCurrentFixedRate: poolFixedRate,
    pool,
  };
};
