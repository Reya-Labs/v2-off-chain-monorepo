import { UpdateBatch, TableType } from '../../../types';
import { MarketFeeConfiguredEvent } from '../specific';
import { getInsertEntryBatch } from '../../../utils/raw-events-support/getInsertEntryBatch';

export const insertMarketFeeConfiguredEvent = (
  environmentV2Tag: string,
  event: MarketFeeConfiguredEvent,
): UpdateBatch => {
  return getInsertEntryBatch(
    environmentV2Tag,
    TableType.raw_market_fee_configured,
    event,
  );
};
