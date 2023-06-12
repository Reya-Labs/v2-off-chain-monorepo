import { SwapEventInfo } from '../../../common/event-parsers/types';
import { getTimestampInSeconds } from '../../../common/utils';
import { sendQueriesInBatches } from '../../sendQueriesInBatches';
import { getTableFullID, secondsToBqDate } from '../../utils';

export const insertNewSwaps = async (
  processName: string,
  events: SwapEventInfo[],
): Promise<void> => {
  const updates: string[] = [];
  const tableId = getTableFullID('active_swaps');
  const currentTimestamp = getTimestampInSeconds();

  for (const event of events) {
    const eventTimestamp = (await event.getBlock()).timestamp;

    const rawSwapRow = `
    "${event.eventId}",
    "${event.vammAddress}",
    "${event.ownerAddress}",
    ${event.tickLower}, 
    ${event.tickUpper}, 
    ${event.variableTokenDelta}, 
    ${event.fixedTokenDeltaUnbalanced},
    ${event.feePaidToLps}, 
    ${event.blockNumber}, 
    '${secondsToBqDate(eventTimestamp)}', 
    '${secondsToBqDate(currentTimestamp)}',
    '${event.rateOracle}',
    '${event.underlyingToken}',
    '${event.marginEngineAddress}',
    ${event.chainId}
  `;

    // build and fire sql query
    const u = `INSERT INTO \`${tableId}\` VALUES (${rawSwapRow});`;
    updates.push(u);
  }

  await sendQueriesInBatches(processName, updates);
};
