import { BigNumber, ethers } from 'ethers';

import { IrsInstanceEventInfo } from './types';

export const parseIrsInstanceEvent = (
  event: ethers.Event,
  chainId: number,
): IrsInstanceEventInfo => {
  const eventId = `${event.blockHash}_${event.transactionHash}_${event.logIndex}`;

  const underlyingToken = event.args?.underlyingToken as string;
  const rateOracleID = event.args?.rateOracle as string;
  const termStartTimestampWad = event.args?.termStartTimestampWad as BigNumber;
  const termEndTimestampWad = event.args?.termEndTimestampWad as BigNumber;
  const marginEngine = event.args?.marginEngine as string;
  const vamm = event.args?.vamm as string;
  const rateOracleIndex = event.args?.yieldBearingProtocolID as number;
  const tokenDecimals = event.args?.underlyingTokenDecimals as number;
  const tickSpacing = event.args?.tickSpacing as number;

  const termStartTimestamp = Math.floor(
    Number(ethers.utils.formatUnits(termStartTimestampWad, 18)),
  );
  const termEndTimestamp = Math.floor(
    Number(ethers.utils.formatUnits(termEndTimestampWad, 18)),
  );

  return {
    ...event,
    eventId: eventId.toLowerCase(),
    type: 'irs_pool_deployment',

    chainId,
    factory: event.address.toLowerCase(),

    vamm: vamm.toLowerCase(),
    marginEngine: marginEngine.toLowerCase(),

    termStartTimestamp,
    termEndTimestamp,

    rateOracleID: rateOracleID.toLowerCase(),
    rateOracleIndex,

    underlyingToken: underlyingToken.toLowerCase(),
    tokenDecimals,

    tickSpacing,
  };
};
