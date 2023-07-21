import { Position as RawPosition } from '@voltz-protocol/subgraph-data';
import { getV1Pool } from '../get-pools/getV1Pool';
import {
  descale,
  tickToFixedRate,
  encodeV1PositionId,
  SECONDS_IN_YEAR,
  convertToAddress,
} from '@voltz-protocol/commons-v2';
import {
  getPositionInfo,
  getVariableFactor,
  getCurrentTick,
  getLatestVariableRate,
} from '@voltz-protocol/indexer-v1';
import { generateMarginEngineContract } from '@voltz-protocol/indexer-v1/src/common/contract-services/generateMarginEngineContract';
import { getPositionPnL } from './getPositionPnL';
import { getProvider } from '../../services/getProvider';
import { V1PortfolioPosition } from '@voltz-protocol/api-sdk-v2';
import { log } from '../../logging/log';

export const buildV1PortfolioPosition = async (
  chainId: number,
  position: RawPosition,
  mode: 'full' | 'light',
): Promise<V1PortfolioPosition> => {
  const now = Date.now().valueOf();

  const vammAddress = position.amm.id;
  const marginEngineAddress = position.amm.marginEngineId;
  const tokenDecimals = position.amm.tokenDecimals;
  const descaler = descale(tokenDecimals);

  const ownerAddress = position.owner;

  const tickLower = position.tickLower;
  const tickUpper = position.tickUpper;

  const fixLow = tickToFixedRate(tickUpper);
  const fixHigh = tickToFixedRate(tickLower);

  const positionId = encodeV1PositionId({
    chainId,
    vammAddress: convertToAddress(vammAddress),
    ownerAddress: convertToAddress(ownerAddress),
    tickLower,
    tickUpper,
  });

  const positionType =
    position.positionType === 3
      ? 'LP'
      : position.positionType === 2
      ? 'Variable'
      : 'Fixed';

  const amm = await getV1Pool(chainId, vammAddress);
  if (!amm) {
    throw new Error(`Could not find v1 pool for ${chainId}-${vammAddress}`);
  }

  // Check if position is settled and return minimum data
  if (position.isSettled && mode === 'light') {
    return {
      id: positionId,
      type: positionType,
      creationTimestampInMS: position.creationTimestampInMS,
      ownerAddress,
      tickLower,
      tickUpper,
      fixLow,
      fixHigh,
      notionalProvided: 0,
      notionalTraded: 0,
      notional: 0,
      margin: 0,
      maxWithdrawableMargin: 0,
      liquidationThreshold: 0,
      safetyThreshold: 0,
      health: 'healthy',
      variant: 'settled',
      receiving: 0,
      paying: 0,
      unrealizedPNL: 0,
      realizedPNLFees: 0,
      realizedPNLCashflow: 0,
      settlementCashflow: 0,

      realizedPNLTotal: 0,

      poolCurrentFixedRate: 0,
      pool: amm,
    };
  }

  // Get fresh information about the position
  const {
    variableTokenBalance,
    fixedTokenBalance,
    notionalTraded,
    notionalProvided,
    margin,
    accumulatedFees,
  } = await getPositionInfo(
    chainId,
    marginEngineAddress,
    tokenDecimals,
    ownerAddress,
    tickLower,
    tickUpper,
  );

  const notional = positionType === 'LP' ? notionalProvided : notionalTraded;

  if (position.amm.termEndTimestampInMS <= now) {
    // Pool is matured

    let realizedPNLCashflow = 0;
    if (!position.isSettled) {
      try {
        const variableFactor = await getVariableFactor(
          chainId,
          position.amm.rateOracleId,
        )(
          position.amm.termStartTimestampInMS,
          position.amm.termEndTimestampInMS,
        );

        const fixedFactor =
          (position.amm.termEndTimestampInMS -
            position.amm.termStartTimestampInMS) /
          SECONDS_IN_YEAR /
          1000;

        realizedPNLCashflow =
          fixedTokenBalance * fixedFactor * 0.01 +
          variableTokenBalance * variableFactor;
      } catch (_) {
        log(`Failed to fetch settlement cashflow.`);
      }
    }

    return {
      id: positionId,
      type: positionType,
      creationTimestampInMS: position.creationTimestampInMS,
      ownerAddress,
      tickLower,
      tickUpper,
      fixLow,
      fixHigh,
      notionalProvided,
      notionalTraded,
      notional,
      margin,
      maxWithdrawableMargin: 0,
      liquidationThreshold: 0,
      safetyThreshold: 0,
      health: 'healthy',
      variant: 'matured',
      receiving: 0,
      paying: 0,
      unrealizedPNL: 0,
      realizedPNLFees: accumulatedFees,
      realizedPNLCashflow,
      settlementCashflow: realizedPNLCashflow,

      realizedPNLTotal: accumulatedFees + realizedPNLCashflow,

      poolCurrentFixedRate: 0,
      pool: amm,
    };
  }

  // Get information about position PnL

  const marginEngine = generateMarginEngineContract(
    marginEngineAddress,
    getProvider(chainId),
  );

  const currentTick = await getCurrentTick(chainId, vammAddress);
  const poolCurrentFixedRate = tickToFixedRate(currentTick);

  const [
    positionPnLResponse,
    latestVariableRateResponse,
    liquidationThresholdResponse,
    safetyThresholdResponse,
  ] = await Promise.allSettled([
    getPositionPnL(
      chainId,
      vammAddress,
      ownerAddress,
      tickLower,
      tickUpper,
      marginEngineAddress,
      position.amm.termEndTimestampInMS,
      poolCurrentFixedRate,
    ),
    getLatestVariableRate(chainId, position.amm.rateOracleId.toLowerCase()),
    marginEngine.callStatic.getPositionMarginRequirement(
      ownerAddress,
      tickLower,
      tickUpper,
      true,
    ),
    marginEngine.callStatic.getPositionMarginRequirement(
      ownerAddress,
      tickLower,
      tickUpper,
      false,
    ),
  ]);

  if (positionPnLResponse.status === 'rejected') {
    throw positionPnLResponse.reason;
  }
  const positionPnL = positionPnLResponse.value;

  const realizedPNLCashflow = positionPnL.realizedPnLFromSwaps;

  const paidFees = positionPnL.realizedPnLFromFeesPaid;

  const unrealizedPNL = positionPnL.unrealizedPnLFromSwaps;

  const fixedRateLocked = positionPnL.fixedRateLocked;

  if (latestVariableRateResponse.status === 'rejected') {
    throw latestVariableRateResponse.reason;
  }
  const { latestRate: variableRate } = latestVariableRateResponse.value;

  let health: 'healthy' | 'danger' | 'warning' = 'healthy';
  let liquidationThreshold = 0;
  let safetyThreshold = 0;

  if (
    liquidationThresholdResponse.status === 'fulfilled' &&
    safetyThresholdResponse.status === 'fulfilled'
  ) {
    liquidationThreshold = descaler(liquidationThresholdResponse.value);
    safetyThreshold = descaler(safetyThresholdResponse.value);

    if (margin + accumulatedFees < liquidationThreshold) {
      health = 'danger';
    } else if (margin + accumulatedFees < safetyThreshold) {
      health = 'warning';
    }
  }

  const receiving =
    positionType === 'LP'
      ? 0
      : positionType === 'Fixed'
      ? fixedRateLocked
      : variableRate;
  const paying =
    positionType === 'LP'
      ? 0
      : positionType === 'Fixed'
      ? variableRate
      : fixedRateLocked;

  return {
    id: positionId,
    type: positionType,
    creationTimestampInMS: position.creationTimestampInMS,
    ownerAddress,
    tickLower,
    tickUpper,
    fixLow,
    fixHigh,
    notionalProvided,
    notionalTraded,
    notional,
    margin: margin - paidFees,
    liquidationThreshold,
    safetyThreshold,
    settlementCashflow: 0,
    maxWithdrawableMargin: Math.max(0, margin - paidFees - safetyThreshold),
    health,
    variant: 'active',
    receiving,
    paying,
    unrealizedPNL,
    realizedPNLFees: accumulatedFees + paidFees,
    realizedPNLCashflow,

    realizedPNLTotal: accumulatedFees + realizedPNLCashflow + paidFees,
    poolCurrentFixedRate,

    pool: amm,
  };
};
