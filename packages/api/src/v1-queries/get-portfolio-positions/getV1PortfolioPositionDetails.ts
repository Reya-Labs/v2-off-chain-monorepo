import { getPositions as getRawPositions } from '@voltz-protocol/subgraph-data';

import { synthetisizeHistory } from './synthetisizeHistory';
import { decodeV1PositionId } from '@voltz-protocol/commons-v2';
import { pullAllChainPools } from '@voltz-protocol/indexer-v1';
import { getSubgraphURL } from '../subgraph/getSubgraphURL';
import { buildV1PortfolioPosition } from './buildV1PortfolioPosition';
import { V1PortfolioPositionDetails } from '@voltz-protocol/api-sdk-v2';

export const getV1PortfolioPositionDetails = async ({
  positionId,
  includeHistory,
}: {
  positionId: string;
  includeHistory: boolean;
}): Promise<V1PortfolioPositionDetails> => {
  const now = Date.now().valueOf();

  const { chainId, vammAddress, ownerAddress, tickLower, tickUpper } =
    decodeV1PositionId(positionId);

  const subgraphURL = getSubgraphURL(chainId);

  // Fetch positions from subgraph
  const positions = subgraphURL
    ? (
        await getRawPositions(
          subgraphURL,
          now,
          {
            owners: [ownerAddress],
            ammIDs: [vammAddress],
          },
          true,
        )
      ).filter((p) => p.tickLower === tickLower && p.tickUpper === tickUpper)
    : [];

  // Check the number of positions to be 1
  if (positions.length === 0 || positions.length >= 2) {
    throw new Error('No position');
  }

  // Process the found position
  const position = positions[0];

  const response = await buildV1PortfolioPosition(chainId, position, 'full');

  const txs = synthetisizeHistory(position);
  const shouldIncludeHistory = response.pool.flags.isGLP28Jun2023
    ? false
    : includeHistory;

  const isMatured = position.amm.termEndTimestampInMS <= now;

  if (position.isSettled) {
    const realizedPNLCashflow = position.settlements[0].settlementCashflow;

    txs.push({
      type: 'maturity',
      creationTimestampInMS: position.amm.termEndTimestampInMS,
      notional: 0,
      paidFees: 0,
      fixedRate: 0,
      marginDelta: realizedPNLCashflow,
    });

    txs.sort((a, b) => b.creationTimestampInMS - a.creationTimestampInMS);

    return {
      ...response,
      canEdit: false,
      canSettle: false,
      rolloverPoolId: null,

      realizedPNLCashflow,
      realizedPNLTotal: realizedPNLCashflow + response.realizedPNLFees,

      history: shouldIncludeHistory ? txs : [],
    };
  } else if (
    response.pool.flags.isGLP28Jun2023 ||
    response.pool.flags.isArbAaveAugust
  ) {
    return {
      ...response,

      canEdit: false,
      canSettle: true,
      rolloverPoolId: null,

      history: shouldIncludeHistory ? txs : [],
    };
  }

  if (isMatured) {
    // Check for available rollovers
    const pools = (await pullAllChainPools([chainId]))
      .filter(
        (pool) =>
          pool.protocolId === position.amm.protocolId &&
          pool.tokenId.toLowerCase() === position.amm.tokenId.toLowerCase() &&
          pool.termEndTimestampInMS >= now,
      )
      .sort((a, b) => b.termEndTimestampInMS - a.termEndTimestampInMS);

    const rolloverPoolId = pools.length === 0 ? null : pools[0].vamm;

    txs.push({
      type: 'maturity',
      creationTimestampInMS: position.amm.termEndTimestampInMS,
      notional: 0,
      paidFees: 0,
      fixedRate: 0,
      marginDelta: response.realizedPNLCashflow,
    });

    txs.sort((a, b) => b.creationTimestampInMS - a.creationTimestampInMS);

    return {
      ...response,

      canEdit: false,
      canSettle: true,
      rolloverPoolId,

      history: shouldIncludeHistory ? txs : [],
    };
  }

  return {
    ...response,

    canEdit: true,
    canSettle: false,
    rolloverPoolId: null,

    history: shouldIncludeHistory ? txs : [],
  };
};
