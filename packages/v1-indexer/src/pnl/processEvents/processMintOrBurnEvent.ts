import { getTimestampInSeconds } from '@voltz-protocol/commons-v2';
import { TrackedBigQueryPositionRow } from '../../big-query-support/positions-table/pull-data/pullAllPositions';
import { MintOrBurnEventInfo } from '../../common/event-parsers/types';

export const processMintOrBurnEvent = (
  currentPositions: TrackedBigQueryPositionRow[],
  event: MintOrBurnEventInfo,
): void => {
  const currentTimestamp = getTimestampInSeconds();

  const existingPositionIndex = currentPositions.findIndex(({ position }) => {
    return (
      position.chainId === event.chainId &&
      position.vammAddress === event.vammAddress &&
      position.ownerAddress === event.ownerAddress &&
      position.tickLower === event.tickLower &&
      position.tickUpper === event.tickUpper
    );
  });

  if (existingPositionIndex === -1) {
    // Position does not exist in the table, add new one

    const newPosition: TrackedBigQueryPositionRow = {
      position: {
        marginEngineAddress: event.marginEngineAddress,
        vammAddress: event.vammAddress,
        ownerAddress: event.ownerAddress,
        tickLower: event.tickLower,
        tickUpper: event.tickUpper,
        realizedPnLFromSwaps: 0,
        realizedPnLFromFeesPaid: 0,
        netNotionalLocked: 0,
        netFixedRateLocked: 0,
        lastUpdatedBlockNumber: event.blockNumber,
        notionalLiquidityProvided: event.notionalDelta,
        realizedPnLFromFeesCollected: 0,
        netMarginDeposited: 0,
        rateOracleIndex: event.amm.protocolId,
        rowLastUpdatedTimestamp: currentTimestamp,
        fixedTokenBalance: 0,
        variableTokenBalance: 0,
        positionInitializationBlockNumber: event.blockNumber,
        rateOracle: event.amm.rateOracle,
        underlyingToken: event.amm.tokenName,
        chainId: event.chainId,
        cashflowLiFactor: 0,
        cashflowTimeFactor: 0,
        cashflowFreeTerm: 0,
        liquidity: event.liquidityDelta,
      },
      added: true,
      modified: true,
    };

    currentPositions.push(newPosition);

    return;
  }

  // Update the exisiting position
  const notionalLiquidityProvided =
    currentPositions[existingPositionIndex].position.notionalLiquidityProvided +
    event.notionalDelta;

  const liquidity =
    currentPositions[existingPositionIndex].position.liquidity +
    event.liquidityDelta;

  currentPositions[existingPositionIndex].modified = true;
  currentPositions[existingPositionIndex].position.lastUpdatedBlockNumber =
    event.blockNumber;
  currentPositions[existingPositionIndex].position.notionalLiquidityProvided =
    notionalLiquidityProvided;
  currentPositions[existingPositionIndex].position.rowLastUpdatedTimestamp =
    currentTimestamp;
  currentPositions[existingPositionIndex].position.liquidity = liquidity;
};
