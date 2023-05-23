import { CollateralUpdateEvent } from '../event-parsers/types';
import { pullCollateralUpdateEvent } from '../services/big-query/collateral-updates-table/pull-data/pullExistingMarginUpdateRow';
import { insertCollateralUpdateEvent } from '../services/big-query/collateral-updates-table/push-data/insertNewMarginUpdate';

export const handleCollateralUpdate = async (event: CollateralUpdateEvent) => {
  const existingEvent = await pullCollateralUpdateEvent(event.id);

  if (existingEvent) {
    return;
  }

  await insertCollateralUpdateEvent(event);
};
