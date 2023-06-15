import { getPositions as getRawPositions } from '@voltz-protocol/subgraph-data';

import { PortfolioPositionAMM } from '../portfolio-positions/types';
import { synthetisizeHistory } from './synthetisizeHistory';
import { PortfolioPositionDetails } from './types';
import {
  tickToFixedRate,
  getTokenPriceInUSD,
  SECONDS_IN_YEAR,
  getProtocolName,
  isBorrowingProtocol,
} from '@voltz-protocol/commons-v2';
import {
  getPositionInfo,
  getVariableFactor,
  pullAllChainPools,
} from '@voltz-protocol/indexer-v1';
import { getPositionPnL } from '../position-pnl/getPositionPnL';
import { getSubgraphURL } from '../subgraph/getSubgraphURL';

const decodePositionId = (
  positionId: string,
): {
  chainId: number;
  vammAddress: string;
  ownerAddress: string;
  tickLower: number;
  tickUpper: number;
} => {
  const parts = positionId.split('_');

  return {
    chainId: Number(parts[0]),
    vammAddress: parts[1],
    ownerAddress: parts[2],
    tickLower: Number(parts[3]),
    tickUpper: Number(parts[4]),
  };
};
type GetPortfolioPositionDetails = {
  positionId: string;
  includeHistory: boolean;
};
export const getPortfolioPositionDetails = async ({
  positionId,
  includeHistory,
}: GetPortfolioPositionDetails): Promise<PortfolioPositionDetails> => {
  const now = Date.now().valueOf();

  const { chainId, vammAddress, ownerAddress, tickLower, tickUpper } =
    decodePositionId(positionId);

  const fixLow = tickToFixedRate(tickUpper);
  const fixHigh = tickToFixedRate(tickLower);

  const subgraphURL = getSubgraphURL(chainId);
  // Get transaction history
  const positions = subgraphURL
    ? (
        await getRawPositions(
          subgraphURL,
          now,
          {
            owners: [ownerAddress],
            ammIDs: [vammAddress],
          },
          includeHistory,
        )
      ).filter((p) => p.tickLower === tickLower && p.tickUpper === tickUpper)
    : [];

  if (positions.length === 0 || positions.length >= 2) {
    throw new Error('No position');
  }

  const position = positions[0];

  const positionType =
    position.positionType === 3
      ? 'LP'
      : position.positionType === 2
      ? 'Variable'
      : 'Fixed';
  const tokenName = position.amm.tokenName;

  const txs = synthetisizeHistory(position);

  const amm: PortfolioPositionAMM = {
    id: vammAddress,
    chainId,

    marginEngineAddress: position.amm.marginEngineId,
    isV2: false,
    isBorrowing: isBorrowingProtocol(position.amm.protocolId),
    market: getProtocolName(position.amm.protocolId),

    rateOracle: {
      address: position.amm.rateOracleId,
      protocolId: position.amm.protocolId,
    },

    underlyingToken: {
      address: position.amm.tokenId,
      name: tokenName.toLowerCase() as 'eth' | 'usdc' | 'usdt' | 'dai',
      tokenDecimals: position.amm.tokenDecimals,
    },

    termStartTimestampInMS: position.amm.termStartTimestampInMS,
    termEndTimestampInMS: position.amm.termEndTimestampInMS,
  };

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
    position.amm.marginEngineId,
    position.amm.tokenDecimals,
    ownerAddress,
    tickLower,
    tickUpper,
  );

  const notional = positionType === 'LP' ? notionalProvided : notionalTraded;

  const tokenPriceUSD = await getTokenPriceInUSD(position.amm.tokenName);

  if (position.isSettled) {
    if (position.settlements.length === 0 || position.settlements.length >= 2) {
      throw new Error('No settlement event');
    }

    const realizedPNLFees = accumulatedFees;
    const realizedPNLCashflow = position.settlements[0].settlementCashflow;
    const realizedPNLTotal = realizedPNLFees + realizedPNLCashflow;

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
      id: positionId,
      variant: 'settled',
      type: positionType,
      creationTimestampInMS: position.creationTimestampInMS,

      tickLower,
      tickUpper,

      fixLow,
      fixHigh,

      tokenPriceUSD,
      notional,
      margin,

      canEdit: false,
      canSettle: false,
      rolloverAmmId: null,

      realizedPNLFees,
      realizedPNLCashflow,
      realizedPNLTotal,

      history: txs,
      amm,
    };
  }

  const isMatured = position.amm.termEndTimestampInMS <= now;

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

    const rolloverAmmId = pools.length === 0 ? null : pools[0].vamm;

    // Get settlement cashflow
    let settlementCashflow = 0;
    try {
      const variableFactor = await getVariableFactor(
        chainId,
        position.amm.rateOracleId,
      )(position.amm.termStartTimestampInMS, position.amm.termEndTimestampInMS);
      const fixedFactor =
        (position.amm.termEndTimestampInMS -
          position.amm.termStartTimestampInMS) /
        SECONDS_IN_YEAR /
        1000;

      settlementCashflow =
        fixedTokenBalance * fixedFactor * 0.01 +
        variableTokenBalance * variableFactor;
    } catch (_) {
      console.log(`Failed to fetch settlement cashflow.`);
    }

    const realizedPNLCashflow = settlementCashflow;

    const realizedPNLFees = accumulatedFees;
    const realizedPNLTotal = realizedPNLFees + realizedPNLCashflow;

    txs.push({
      type: 'maturity',
      creationTimestampInMS: position.amm.termEndTimestampInMS,
      notional: 0,
      paidFees: 0,
      fixedRate: 0,
      marginDelta: settlementCashflow,
    });

    txs.sort((a, b) => b.creationTimestampInMS - a.creationTimestampInMS);

    return {
      id: positionId,
      variant: 'matured',
      type: positionType,
      creationTimestampInMS: position.creationTimestampInMS,

      tickLower,
      tickUpper,

      fixLow,
      fixHigh,

      tokenPriceUSD,
      notional,
      margin,

      canEdit: false,
      canSettle: true,
      rolloverAmmId,

      realizedPNLFees,
      realizedPNLCashflow,
      realizedPNLTotal,

      history: txs,
      amm,
    };
  }

  const { realizedPnLFromSwaps: realizedPNLCashflow } = await getPositionPnL(
    chainId,
    vammAddress,
    ownerAddress,
    tickLower,
    tickUpper,
  );

  const realizedPNLFees = accumulatedFees;
  const realizedPNLTotal = realizedPNLFees + realizedPNLCashflow;

  return {
    id: positionId,
    variant: 'matured',
    type: positionType,
    creationTimestampInMS: position.creationTimestampInMS,

    tickLower,
    tickUpper,

    fixLow,
    fixHigh,

    tokenPriceUSD,
    notional,
    margin,

    canEdit: true,
    canSettle: false,
    rolloverAmmId: null,

    realizedPNLFees,
    realizedPNLCashflow,
    realizedPNLTotal,

    history: txs,
    amm,
  };
};
