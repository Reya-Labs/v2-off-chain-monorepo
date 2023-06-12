import { getTimestampInSeconds } from '@voltz-protocol/commons-v2';
import { IrsInstanceEventInfo } from '../../../common/event-parsers/types';
import { getTokenName } from '../../../common/getTokenName';
import { getBigQuery } from '../../../global';
import { TableType, getTableFullID } from '../../utils';

export const insertNewPool = async (
  event: IrsInstanceEventInfo,
): Promise<void> => {
  const bigQuery = getBigQuery();

  const eventTimestamp = (await event.getBlock()).timestamp;
  const currentTimestamp = getTimestampInSeconds();

  const rawPoolRow = `
    ${event.chainId},
    "${event.factory}",

    ${event.blockNumber}, 
    ${eventTimestamp * 1000},
    ${currentTimestamp * 1000},

    "${event.vamm}",
    "${event.marginEngine}",
    "${event.rateOracleID}",
    ${event.rateOracleIndex},

    ${event.tickSpacing},

    ${event.termStartTimestamp * 1000}, 
    ${event.termEndTimestamp * 1000}, 

    "${event.underlyingToken}",
    "${getTokenName(event.underlyingToken)}",
    ${event.tokenDecimals},

    false,
    false,
    false,

    0,
    ""
  `;

  const sqlTransactionQuery = `INSERT INTO \`${getTableFullID(
    TableType.pools,
  )}\` VALUES (${rawPoolRow});`;

  const options = {
    query: sqlTransactionQuery,
    timeoutMs: 100000,
    useLegacySql: false,
  };

  await bigQuery.query(options);
};
