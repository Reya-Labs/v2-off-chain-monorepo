import {
  tickToFixedRate,
  getTimestampInSeconds,
  convertLowercaseString,
  computeRealizedPnL,
  computeUnrealizedPnL,
} from '@voltz-protocol/commons-v2';

import {
  PositionEntry,
  getLiquidityIndexAt,
  pullAccountCollateral,
  pullAccountEntry,
} from '@voltz-protocol/bigquery-v2';
import { getV2Pool } from '../get-pools/getV2Pool';
import { V2PortfolioPosition } from './types';

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
  lockedFixedRate,
  notional: notionalTraded,
  paidFees,
  tickLower,
  tickUpper,
  creationTimestamp,
}: PositionEntry): Promise<V2PortfolioPosition> => {
  const account = await pullAccountEntry(chainId, accountId);

  if (!account) {
    throw new Error(`Couldn't fetch account for ${chainId}-${accountId}`);
  }

  const ownerAddress = account.owner;

  const accountCollaterals = await pullAccountCollateral(chainId, accountId);

  if (accountCollaterals.length === 0) {
    throw new Error(`Couldn't find position`);
  }

  const { balance: margin } = accountCollaterals[0];

  const pool = await getV2Pool(chainId, marketId, maturityTimestamp);

  if (!pool) {
    throw new Error(
      `Pool ${chainId}-${marketId}-${maturityTimestamp} was not found.`,
    );
  }

  const poolFixedRate = pool.currentFixedRate;
  const poolVariableRate = pool.currentVariableRate;

  const fixedRateLocked = lockedFixedRate;

  const fixLow = tickToFixedRate(tickUpper);
  const fixHigh = tickToFixedRate(tickLower);

  // notional balance
  const notionalProvided = 0;
  const notional = positionType === 'lp' ? notionalProvided : notionalTraded;

  // health factor
  const health = 'healthy';

  // variant
  const variant = 'active';

  // current liquidity index
  const now = getTimestampInSeconds();
  const liquidityIndex = await getLiquidityIndexAt(
    chainId,
    convertLowercaseString(pool.rateOracle.address),
    now,
  );

  if (!liquidityIndex) {
    throw new Error(
      `Couldn't fetch current liquidity index for ${chainId} - ${pool.rateOracle.address}`,
    );
  }

  // PnL
  const realizedPNLFees = -paidFees;

  const realizedPNLCashflow = computeRealizedPnL({
    base,
    timeDependentQuote,
    freeQuote,
    queryTimestamp: now,
    liquidityIndexAtQuery: liquidityIndex,
  });

  const unrealizedPNL = computeUnrealizedPnL({
    base,
    timeDependentQuote,
    freeQuote,
    currentLiquidityIndex: liquidityIndex,
    currentFixedRate: poolFixedRate,
    maturityTimestamp,
  });

  // Build response
  const response: V2PortfolioPosition = {
    id: positionId,
    accountId,
    ownerAddress,
    type: positionType === 'lp' ? 'LP' : notional < 0 ? 'Fixed' : 'Variable',
    creationTimestampInMS: creationTimestamp * 1000,
    tickLower,
    tickUpper,
    fixLow,
    fixHigh,
    notionalProvided,
    notionalTraded,
    notional,
    margin,
    health,
    variant,
    receiving: notional < 0 ? fixedRateLocked : poolVariableRate,
    paying: notional < 0 ? poolVariableRate : fixedRateLocked,
    unrealizedPNL,
    realizedPNLFees,
    realizedPNLCashflow,
    realizedPNLTotal: realizedPNLCashflow + realizedPNLFees,
    poolCurrentFixedRate: poolFixedRate,
    pool,
  };

  return response;
};
