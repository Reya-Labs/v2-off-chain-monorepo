import { ethers } from 'ethers';

import { BigQueryPoolRow } from '../../big-query-support/types';
import { VAMMPriceChangeEventInfo } from './types';

export const parseVAMMPriceChangeEvent = (
  event: ethers.Event,
  amm: BigQueryPoolRow,
  chainId: number,
  isInitial: boolean,
): VAMMPriceChangeEventInfo => {
  const eventId = `${event.blockHash}_${event.transactionHash}_${event.logIndex}`;
  const tick = event.args?.tick as number;

  return {
    ...event,
    eventId: eventId.toLowerCase(),
    type: 'price_change',

    chainId: chainId,
    vammAddress: amm.vamm.toLowerCase(),
    amm,

    rateOracle: amm.rateOracle,
    underlyingToken: amm.tokenName,
    marginEngineAddress: amm.marginEngine,

    isInitial,
    tick,
  };
};
