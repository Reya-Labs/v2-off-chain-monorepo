import { CollateralUpdateEvent } from '../event-parsers/types';
import { pullCollateralUpdateEvent } from '../services/big-query/collateral-updates-table/pull-data/pullCollateralUpdateEvent';
import { insertCollateralUpdateEvent } from '../services/big-query/collateral-updates-table/push-data/insertCollateralUpdateEvent';

export const handleCollateralUpdate = async (event: CollateralUpdateEvent) => {
  const existingEvent = await pullCollateralUpdateEvent(event.id);

  if (existingEvent) {
    return;
  }

  await insertCollateralUpdateEvent(event);
};
