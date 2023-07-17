import { UpdateBatch, TableType } from '../../../types';
import { MarketConfiguredEvent } from '../specific';
import { getInsertEntryBatch } from '../../../utils/raw-events-support/getInsertEntryBatch';

export const insertMarketConfiguredEvent = (
  environmentV2Tag: string,
  event: MarketConfiguredEvent,
): UpdateBatch => {
  return getInsertEntryBatch(
    environmentV2Tag,
    TableType.raw_market_configured,
    event,
  );
};
