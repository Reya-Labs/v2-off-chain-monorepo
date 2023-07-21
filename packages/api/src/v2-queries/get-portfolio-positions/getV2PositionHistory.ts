import {
  HistoryTransaction,
  V2PortfolioPosition,
} from '@voltz-protocol/api-sdk-v2';
import {
  getLiquidityIndicesAt,
  pullCollateralEventsByAccount,
  pullDatedIRSPositionSettledEventsByAccountAndPool,
  pullLiquidationsByAccount,
  pullLiquidityChangesByAccountAndPool,
  pullTakerOrdersByAccountAndPool,
} from '@voltz-protocol/bigquery-v2';
import { getEnvironmentV2 } from '../../services/envVars';
import {
  SECONDS_IN_YEAR,
  convertToAddress,
  getDeltasFromLiquidity,
  getTimestampInSeconds,
} from '@voltz-protocol/commons-v2';
import { log } from '../../logging/log';

export const getV2PositionHistory = async (
  position: V2PortfolioPosition,
): Promise<HistoryTransaction[]> => {
  const environmentTag = getEnvironmentV2();

  const { chainId, termEndTimestampInMS, marketId, rateOracle } = position.pool;
  const maturityTimestamp = getTimestampInSeconds(termEndTimestampInMS);
  const { accountId, tickLower, tickUpper, realizedPNLCashflow } = position;

  const [
    collateralEventsResponse,
    liquidationsResponse,
    takerOrdersResponse,
    liquidityChangesResponse,
    settlementsResponse,
  ] = await Promise.allSettled([
    pullCollateralEventsByAccount(environmentTag, chainId, accountId),
    pullLiquidationsByAccount(environmentTag, chainId, accountId),
    pullTakerOrdersByAccountAndPool(
      environmentTag,
      chainId,
      accountId,
      marketId,
      maturityTimestamp,
    ),
    pullLiquidityChangesByAccountAndPool(
      environmentTag,
      chainId,
      accountId,
      marketId,
      maturityTimestamp,
    ),
    pullDatedIRSPositionSettledEventsByAccountAndPool(
      environmentTag,
      chainId,
      accountId,
      marketId,
      maturityTimestamp,
    ),
  ]);

  // todo: add logging if any of the responses is rejected

  const history: HistoryTransaction[] = [];

  if (collateralEventsResponse.status === 'fulfilled') {
    history.push(
      ...collateralEventsResponse.value.map(
        (e): HistoryTransaction => ({
          type: 'margin-update',
          creationTimestampInMS: e.blockTimestamp * 1000,
          notional: 0,
          paidFees: 0,
          fixedRate: 0,
          marginDelta: e.tokenAmount,
        }),
      ),
    );
  } else {
    log('Could not fetch collateral events');
  }

  if (liquidationsResponse.status === 'fulfilled') {
    // todo: notional unwound not tracked in the liquidation
    // (what if we track product position updates instead of taker orders)

    history.push(
      ...liquidationsResponse.value.map(
        (e): HistoryTransaction => ({
          type: 'liquidation',
          creationTimestampInMS: e.blockTimestamp * 1000,
          notional: 0,
          paidFees: 0,
          fixedRate: 0,
          marginDelta: -e.liquidatorRewardAmount,
        }),
      ),
    );
  } else {
    log('Could not fetch liquidations');
  }

  if (takerOrdersResponse.status === 'fulfilled') {
    // todo: notional unwound not tracked in the liquidation
    // (what if we track product position updates instead of taker orders)

    history.push(
      ...takerOrdersResponse.value.map((e): HistoryTransaction => {
        const timeDelta =
          (maturityTimestamp - e.blockTimestamp) / SECONDS_IN_YEAR;
        const notional = e.annualizedNotionalAmount / timeDelta;

        const fixedRate =
          notional === 0 || timeDelta <= 0
            ? 0
            : (-e.executedQuoteAmount / notional - 1) / timeDelta;

        // todo: fill in fees paid
        return {
          type: 'swap',
          creationTimestampInMS: e.blockTimestamp * 1000,
          notional,
          paidFees: 0,
          fixedRate,
          marginDelta: 0,
        };
      }),
    );
  } else {
    log('Could not fetch taker orders');
  }

  if (liquidityChangesResponse.status === 'fulfilled') {
    for (const e of liquidityChangesResponse.value) {
      const { x: base } = getDeltasFromLiquidity(
        e.liquidityDelta,
        tickLower,
        tickUpper,
      );

      let notional = 0;
      try {
        const [liquidityIndex] = await getLiquidityIndicesAt(
          environmentTag,
          chainId,
          convertToAddress(rateOracle.address),
          [e.blockTimestamp],
        );

        notional = base * (liquidityIndex || 0);
      } catch (_) {
        // todo: add logging
      }

      // todo: fill in fees paid
      const h: HistoryTransaction = {
        type: notional < 0 ? 'burn' : 'mint',
        creationTimestampInMS: e.blockTimestamp * 1000,
        notional: Math.abs(notional),
        paidFees: 0,
        fixedRate: 0,
        marginDelta: 0,
      };

      history.push(h);
    }
  } else {
    log('Could not fetch LP events');
  }

  if (settlementsResponse.status === 'fulfilled') {
    history.push(
      ...settlementsResponse.value.map((e): HistoryTransaction => {
        return {
          type: 'settlement',
          creationTimestampInMS: e.blockTimestamp * 1000,
          notional: 0,
          paidFees: 0,
          fixedRate: 0,
          marginDelta: e.settlementCashflowInQuote,
        };
      }),
    );
  } else {
    log('Could not fetch settlements');
  }

  if (maturityTimestamp <= getTimestampInSeconds()) {
    history.push({
      type: 'maturity',
      creationTimestampInMS: maturityTimestamp * 1000,
      notional: 0,
      paidFees: 0,
      fixedRate: 0,
      marginDelta: realizedPNLCashflow,
    });
  }

  history.sort((a, b) => b.creationTimestampInMS - a.creationTimestampInMS);

  return history;
};
