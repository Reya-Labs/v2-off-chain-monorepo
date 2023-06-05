import {
  CollateralUpdateEvent,
  pullCollateralUpdateEvent,
  insertCollateralUpdateEvent,
} from '@voltz-protocol/commons-v2';

export const handleCollateralUpdate = async (event: CollateralUpdateEvent) => {
  const existingEvent = await pullCollateralUpdateEvent(event.id);

  if (existingEvent) {
    return;
  }

  await insertCollateralUpdateEvent(event);
};
