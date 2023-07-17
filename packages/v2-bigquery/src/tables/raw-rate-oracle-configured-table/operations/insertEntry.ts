import { UpdateBatch, TableType } from '../../../types';
import { RateOracleConfiguredEvent } from '../specific';
import { getInsertEntryBatch } from '../../../utils/raw-events-support/getInsertEntryBatch';

export const insertRateOracleConfiguredEvent = (
  environmentV2Tag: string,
  event: RateOracleConfiguredEvent,
): UpdateBatch => {
  return getInsertEntryBatch(
    environmentV2Tag,
    TableType.raw_rate_oracle_configured,
    event,
  );
};
