import { UpdateBatch, TableType } from '../../../types';
import { VammConfigUpdatedEvent } from '../specific';
import { getInsertEntryBatch } from '../../../utils/raw-events-support/getInsertEntryBatch';

export const insertVammConfigUpdatedEvent = (
  environmentV2Tag: string,
  event: VammConfigUpdatedEvent,
): UpdateBatch => {
  return getInsertEntryBatch(
    environmentV2Tag,
    TableType.raw_vamm_config_updated,
    event,
  );
};
