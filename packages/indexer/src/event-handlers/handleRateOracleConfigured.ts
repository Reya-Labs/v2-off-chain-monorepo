import { RateOracleConfiguredEvent } from '../event-parsers/types';
import { pullMarketEntry } from '../services/big-query/markets-table/pull-data/pullMarketEntry';
import { insertMarketEntry } from '../services/big-query/markets-table/push-data/insertMarketEntry';
import { updateMarketEntry } from '../services/big-query/markets-table/push-data/updateMarketEntry';
import { pullRateOracleConfiguredEvent } from '../services/big-query/raw-rate-oracle-configured-table/pull-data/pullMarketConfiguredEvent';
import { insertRateOracleConfiguredEvent } from '../services/big-query/raw-rate-oracle-configured-table/push-data/insertMarketConfiguredEvent';
import { ZERO_ACCOUNT, ZERO_ADDRESS } from '../utils/constants';

export const handleRateOracleConfigured = async (
  event: RateOracleConfiguredEvent,
) => {
  // Check if the event has been processed
  const existingEvent = await pullRateOracleConfiguredEvent(event.id);

  if (existingEvent) {
    return;
  }

  await insertRateOracleConfiguredEvent(event);

  // Update market
  const existingMarket = await pullMarketEntry(event.chainId, event.marketId);

  if (existingMarket) {
    await updateMarketEntry(event.chainId, event.marketId, {
      oracleAddress: event.oracleAddress,
    });
  } else {
    await insertMarketEntry({
      chainId: event.chainId,
      marketId: event.marketId,
      quoteToken: ZERO_ADDRESS,
      oracleAddress: event.oracleAddress,
      feeCollectorAccountId: ZERO_ACCOUNT,
      atomicMakerFee: 0,
      atomicTakerFee: 0,
    });
  }
};
