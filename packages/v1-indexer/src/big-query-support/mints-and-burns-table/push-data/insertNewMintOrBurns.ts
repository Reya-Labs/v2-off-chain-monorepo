import { getTimestampInSeconds } from '@voltz-protocol/commons-v2';
import { MintOrBurnEventInfo } from '../../../common/event-parsers/types';
import { sendQueriesInBatches } from '../../sendQueriesInBatches';
import { TableType, getTableFullID, secondsToBqDate } from '../../utils';

export const insertNewMintOrBurns = async (
  processName: string,
  events: MintOrBurnEventInfo[],
): Promise<void> => {
  const updates: string[] = [];
  const tableId = getTableFullID(TableType.mints_and_burns);
  const currentTimestamp = getTimestampInSeconds();

  for (const event of events) {
    const eventTimestamp = (await event.getBlock()).timestamp;

    const rawMintOrBurnRow = `
    "${event.eventId}",
    "${event.vammAddress}",
    "${event.ownerAddress}",
    ${event.tickLower}, 
    ${event.tickUpper}, 
    ${event.notionalDelta}, 
    ${event.blockNumber}, 
    '${secondsToBqDate(eventTimestamp)}', 
    '${secondsToBqDate(currentTimestamp)}',
    '${event.rateOracle}',
    '${event.underlyingToken}',
    '${event.marginEngineAddress}',
    ${event.chainId}
  `;

    const u = `INSERT INTO \`${tableId}\` VALUES (${rawMintOrBurnRow});`;
    updates.push(u);
  }

  await sendQueriesInBatches(processName, updates);
};
