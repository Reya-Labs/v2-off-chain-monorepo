import { TrackedBigQueryPositionRow } from '../../big-query-support/positions-table/pull-data/pullAllPositions';
import { generatePositionRow } from '../../big-query-support/positions-table/push-data/generatePositionRow';
import {
  SwapEventInfo,
  VAMMPriceChangeEventInfo,
} from '../../common/event-parsers/types';
import { calculatePassiveTokenDeltas } from '../../common/services/calculatePassiveTokenDeltas';
import { getLiquidityIndex } from '../../common/services/getLiquidityIndex';

export const processVAMMPriceChangeEvent = async (
  currentPositions: TrackedBigQueryPositionRow[],
  priceChangeVammEventInfo: VAMMPriceChangeEventInfo,
  previousTick: number,
): Promise<void> => {
  const currentTick = priceChangeVammEventInfo.tick;

  // Retrieve event timestamp
  const eventTimestamp = (await priceChangeVammEventInfo.getBlock()).timestamp;

  // Retrieve liquidity index at the event block
  const liquidityIndexAtRootEvent = await getLiquidityIndex(
    priceChangeVammEventInfo.chainId,
    priceChangeVammEventInfo.amm.marginEngine,
    priceChangeVammEventInfo.blockNumber,
  );

  for (let i = 0; i < currentPositions.length; i++) {
    const { position } = currentPositions[i];

    if (!(position.vammAddress === priceChangeVammEventInfo.amm.vamm)) {
      continue;
    }

    if (position.notionalLiquidityProvided <= 0) {
      continue;
    }

    if (
      position.positionInitializationBlockNumber >=
      priceChangeVammEventInfo.blockNumber
    ) {
      continue;
    }

    const { ownerAddress, tickLower, tickUpper, liquidity } = position;

    const { variableTokenDelta, fixedTokenDeltaUnbalanced } =
      calculatePassiveTokenDeltas(
        liquidity,
        tickLower,
        tickUpper,
        previousTick,
        currentTick,
      );

    // todo: enhance this ID -> not high pro as long as we do not add them to the table
    const passiveSwapEventId = `id`;

    const passiveSwapEvent: SwapEventInfo = {
      ...priceChangeVammEventInfo,

      eventId: passiveSwapEventId.toLowerCase(),
      type: 'swap',

      ownerAddress,
      tickLower,
      tickUpper,

      variableTokenDelta,
      fixedTokenDeltaUnbalanced,
      feePaidToLps: 0, // does not apply to passive swaps
    };

    // Generate all passive swap events

    currentPositions[i].modified = true;
    currentPositions[i].position = generatePositionRow(
      priceChangeVammEventInfo.amm,
      passiveSwapEvent,
      eventTimestamp,
      position,
      liquidityIndexAtRootEvent,
    );
  }
};
