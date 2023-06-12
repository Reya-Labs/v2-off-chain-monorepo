import { getTimestampInSeconds } from '@voltz-protocol/commons-v2';
import { MarginUpdateEventInfo } from '../../../common/event-parsers/types';
import { sendQueriesInBatches } from '../../sendQueriesInBatches';
import { getTableFullID, secondsToBqDate } from '../../utils';

export const insertNewMarginUpdates = async (
  processName: string,
  events: MarginUpdateEventInfo[],
): Promise<void> => {
  const updates: string[] = [];
  const tableId = getTableFullID('margin_updates');
  const currentTimestamp = getTimestampInSeconds();

  for (const event of events) {
    const eventTimestamp = (await event.getBlock()).timestamp;

    const rawMarginUpdateRow = `
      "${event.eventId}",
      "${event.vammAddress}",
      "${event.ownerAddress}",
      ${event.tickLower}, 
      ${event.tickUpper}, 
      ${event.marginDelta},
      ${event.blockNumber}, 
      '${secondsToBqDate(eventTimestamp)}', 
      '${secondsToBqDate(currentTimestamp)}',
      '${event.rateOracle}',
      '${event.underlyingToken}',
      '${event.marginEngineAddress}',
      ${event.chainId}
    `;

    // build and fire sql query
    const u = `INSERT INTO \`${tableId}\` VALUES (${rawMarginUpdateRow});`;
    updates.push(u);
  }

  await sendQueriesInBatches(processName, updates);
};
