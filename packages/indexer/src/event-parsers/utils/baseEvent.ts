import { Event } from 'ethers';

import { BaseEvent, EventType } from '../types';
import { convertLowercaseString } from './convertLowercase';

export const parseBaseEvent = (
  chainId: number,
  event: Event,
  type: EventType,
): BaseEvent => {
  const blockTimestamp = event.args?.blockTimestamp as number;

  const id = `${chainId}_${type}_${event.blockHash}_${event.transactionHash}_${event.logIndex}`;

  return {
    id,
    type,

    chainId,
    source: convertLowercaseString(event.address),

    blockTimestamp,
    blockNumber: event.blockNumber,
    blockHash: event.blockHash,

    transactionIndex: event.transactionIndex,
    transactionHash: event.transactionHash,
    logIndex: event.logIndex,
  };
};
