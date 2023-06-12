import { ethers } from 'ethers';

import { BigQueryPoolRow } from '../../big-query-support/types';
import { MarginUpdateEventInfo } from './types';

export const parseMarginUpdateEvent = (
  event: ethers.Event,
  amm: BigQueryPoolRow,
  chainId: number,
): MarginUpdateEventInfo => {
  const eventId = `${event.blockHash}_${event.transactionHash}_${event.logIndex}`;

  const ownerAddress = event.args?.owner as string;
  const tickLower = event.args?.tickLower as number;
  const tickUpper = event.args?.tickUpper as number;

  const tokenDecimals = amm.tokenDecimals;

  const marginDelta = Number(
    ethers.utils.formatUnits(
      event.args?.marginDelta as ethers.BigNumber,
      tokenDecimals,
    ),
  );

  return {
    ...event,
    eventId: eventId.toLowerCase(),
    type: 'margin_update',

    chainId: chainId,
    vammAddress: amm.vamm.toLowerCase(),
    amm,

    rateOracle: amm.rateOracle,
    underlyingToken: amm.tokenName,
    marginEngineAddress: amm.marginEngine,

    ownerAddress: ownerAddress.toLowerCase(),
    tickLower,
    tickUpper,

    marginDelta,
  };
};
