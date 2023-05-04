import { BaseEvent } from './types';

export const wrapEventWithId = <T extends BaseEvent>(
  event: Omit<T, 'id'>,
): T => {
  const eventId = `${event.chainId}_${event.type}_${event.blockHash}_${event.transactionHash}_${event.logIndex}`;

  return {
    ...event,
    id: eventId,
  } as T;
};
