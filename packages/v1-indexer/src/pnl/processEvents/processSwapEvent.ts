import { TrackedBigQueryPositionRow } from '../../big-query-support/positions-table/pull-data/pullAllPositions';
import { generatePositionRow } from '../../big-query-support/positions-table/push-data/generatePositionRow';
import { SwapEventInfo } from '../../common/event-parsers/types';
import { getProvider } from '../../common/provider/getProvider';
import { getLiquidityIndex } from '../../common/services/getLiquidityIndex';

export const processSwapEvent = async (
  currentPositions: TrackedBigQueryPositionRow[],
  event: SwapEventInfo,
): Promise<void> => {
  const provider = getProvider(event.chainId);
  const eventTimestamp = (await provider.getBlock(event.blockNumber)).timestamp;

  const liquidityIndexAtRootEvent = await getLiquidityIndex(
    event.chainId,
    event.amm.marginEngine,
    event.blockNumber,
  );

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

    const newPosition = generatePositionRow(
      event.amm,
      event,
      eventTimestamp,
      null,
      liquidityIndexAtRootEvent,
    );

    currentPositions.push({
      position: newPosition,
      added: true,
      modified: true,
    });

    return;
  }

  const newPosition = generatePositionRow(
    event.amm,
    event,
    eventTimestamp,
    currentPositions[existingPositionIndex].position,
    liquidityIndexAtRootEvent,
  );

  currentPositions[existingPositionIndex].modified = true;
  currentPositions[existingPositionIndex].position = newPosition;
};
