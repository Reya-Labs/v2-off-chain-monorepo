import { BigNumber, Event } from 'ethers';

import { convertToAddress } from '@voltz-protocol/commons-v2';
import { BaseEvent, ProtocolEventType } from '@voltz-protocol/bigquery-v2';

export const parseBaseEvent = (
  chainId: number,
  event: Event,
  type: ProtocolEventType,
): BaseEvent => {
  const blockTimestamp = (event.args?.blockTimestamp as BigNumber).toNumber();

  const id = `${chainId}$${type}$${event.blockHash}$${event.transactionHash}$${event.logIndex}`;

  return {
    id,
    type,

    chainId,
    source: convertToAddress(event.address),

    blockTimestamp,
    blockNumber: event.blockNumber,
    blockHash: event.blockHash,

    transactionIndex: event.transactionIndex,
    transactionHash: event.transactionHash,
    logIndex: event.logIndex,
  };
};
