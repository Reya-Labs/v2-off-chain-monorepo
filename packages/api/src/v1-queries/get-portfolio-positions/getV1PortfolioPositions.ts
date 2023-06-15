import {
  getPositions as getRawPositions,
  Position as RawPosition,
} from '@voltz-protocol/subgraph-data';

import { V1PortfolioPosition } from './types';
import {
  descale,
  tickToFixedRate,
  getProvider,
  SECONDS_IN_YEAR,
} from '@voltz-protocol/commons-v2';
import {
  getPositionInfo,
  getVariableFactor,
  getCurrentTick,
  getLatestVariableRate,
} from '@voltz-protocol/indexer-v1';
import { generateMarginEngineContract } from '@voltz-protocol/indexer-v1/src/common/contract-services/generateMarginEngineContract';
import { getPositionPnL } from '../position-pnl/getPositionPnL';
import { getSubgraphURL } from '../subgraph/getSubgraphURL';
import { getV1Pool } from '../get-pools/getV1Pool';

export const getV1PortfolioPositions = async (
  chainIds: number[],
  ownerAddress: string,
): Promise<V1PortfolioPosition[]> => {
  const now = Date.now().valueOf();

  const allPositions: (RawPosition & { chainId: number })[] = [];
  for (const chainId of chainIds) {
    const subgraphURL = getSubgraphURL(chainId);
    const positions = subgraphURL
      ? await getRawPositions(subgraphURL, now, {
          owners: [ownerAddress],
        })
      : [];

    allPositions.push(
      ...positions.map((p) => ({
        ...p,
        chainId,
      })),
    );
  }

  const responses = await Promise.allSettled(
    allPositions.map(async (pos): Promise<V1PortfolioPosition> => {
      const chainId = pos.chainId;
      const vammAddress = pos.amm.id;
      const marginEngineAddress = pos.amm.marginEngineId;
      const tokenDecimals = pos.amm.tokenDecimals;
      const descaler = descale(tokenDecimals);

      const tickLower = pos.tickLower;
      const tickUpper = pos.tickUpper;

      const fixLow = tickToFixedRate(tickUpper);
      const fixHigh = tickToFixedRate(tickLower);

      const positionId = `${chainId}_${vammAddress.toLowerCase()}_${ownerAddress.toLowerCase()}_${tickLower}_${tickUpper}`;
      const positionType =
        pos.positionType === 3
          ? 'LP'
          : pos.positionType === 2
          ? 'Variable'
          : 'Fixed';

      const amm = await getV1Pool(chainId, vammAddress);
      if (!amm) {
        throw new Error(
          `Could not find pool (in BigQuery) for ${chainId}-${vammAddress}`,
        );
      }
      const tokenPriceUSD = amm.underlyingToken.priceUSD;

      // Check if position is settled and return minimum data
      if (pos.isSettled) {
        return {
          id: positionId,
          type: positionType,
          creationTimestampInMS: pos.creationTimestampInMS,
          ownerAddress,
          tickLower,
          tickUpper,
          fixLow,
          fixHigh,
          notionalProvided: 0,
          notionalTraded: 0,
          notional: 0,
          margin: 0,
          status: {
            health: 'healthy',
            variant: 'settled',
            currentFixed: 0,
            receiving: 0,
            paying: 0,
          },
          unrealizedPNL: 0,
          realizedPNLFees: 0,
          realizedPNLCashflow: 0,

          realizedPNLTotal: 0,
          tokenPriceUSD,

          amm,
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

      const notional =
        positionType === 'LP' ? notionalProvided : notionalTraded;

      if (pos.amm.termEndTimestampInMS <= now) {
        // Position is matured

        let settlementCashflow = 0;
        try {
          const variableFactor = await getVariableFactor(
            chainId,
            pos.amm.rateOracleId,
          )(pos.amm.termStartTimestampInMS, pos.amm.termEndTimestampInMS);
          const fixedFactor =
            (pos.amm.termEndTimestampInMS - pos.amm.termStartTimestampInMS) /
            SECONDS_IN_YEAR /
            1000;

          settlementCashflow =
            fixedTokenBalance * fixedFactor * 0.01 +
            variableTokenBalance * variableFactor;
        } catch (_) {
          console.log(`Failed to fetch settlement cashflow.`);
        }

        const realizedPNLCashflow = settlementCashflow;

        return {
          id: positionId,
          type: positionType,
          creationTimestampInMS: pos.creationTimestampInMS,
          ownerAddress,
          tickLower,
          tickUpper,
          fixLow,
          fixHigh,
          notionalProvided,
          notionalTraded,
          notional,
          margin,
          status: {
            health: 'healthy',
            variant: 'matured',
            currentFixed: 0,
            receiving: 0,
            paying: 0,
          },
          unrealizedPNL: 0,
          realizedPNLFees: accumulatedFees,
          realizedPNLCashflow,

          realizedPNLTotal: accumulatedFees + realizedPNLCashflow,
          tokenPriceUSD,

          amm,
        };
      }

      // Get information about position PnL

      const marginEngine = generateMarginEngineContract(
        marginEngineAddress,
        getProvider(chainId),
      );

      const [
        positionPnLResponse,
        currentTickResponse,
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
        ),
        getCurrentTick(chainId, vammAddress),
        getLatestVariableRate(chainId, pos.amm.rateOracleId.toLowerCase()),
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

      if (currentTickResponse.status === 'rejected') {
        throw currentTickResponse.reason;
      }
      const currentTick = currentTickResponse.value;
      const currentFixed = tickToFixedRate(currentTick);

      let health: 'healthy' | 'danger' | 'warning' = 'healthy';

      if (
        liquidationThresholdResponse.status === 'fulfilled' &&
        safetyThresholdResponse.status === 'fulfilled'
      ) {
        const liquidationThreshold = descaler(
          liquidationThresholdResponse.value,
        );
        const safetyThreshold = descaler(safetyThresholdResponse.value);

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
        creationTimestampInMS: pos.creationTimestampInMS,
        ownerAddress,
        tickLower,
        tickUpper,
        fixLow,
        fixHigh,
        notionalProvided,
        notionalTraded,
        notional,
        margin: margin - paidFees,
        status: {
          health,
          variant: 'active',
          currentFixed,
          receiving,
          paying,
        },
        unrealizedPNL,
        realizedPNLFees: accumulatedFees + paidFees,
        realizedPNLCashflow,

        realizedPNLTotal: accumulatedFees + realizedPNLCashflow + paidFees,
        tokenPriceUSD,

        amm,
      };
    }),
  );

  const positions = responses.map((resp) => {
    if (resp.status === 'fulfilled') {
      return resp.value;
    }
    throw new Error(
      `Promise rejected with error: ${(resp.reason as Error).message}`,
    );
  });

  positions.sort((a, b) => b.creationTimestampInMS - a.creationTimestampInMS);

  return positions;
};
