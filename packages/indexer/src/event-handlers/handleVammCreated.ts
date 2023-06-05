import { VammCreatedEvent } from '../event-parsers/types';
import { pullVammCreatedEvent } from '../services/big-query/raw-vamm-created-table/pull-data/pullVammCreatedEvent';
import { insertVammCreatedEvent } from '../services/big-query/raw-vamm-created-table/push-data/insertVammCreatedEvent';

export const handleVammCreated = async (event: VammCreatedEvent) => {
  const existingEvent = await pullVammCreatedEvent(event.id);

  if (existingEvent) {
    return;
  }

  await insertVammCreatedEvent(event);
};