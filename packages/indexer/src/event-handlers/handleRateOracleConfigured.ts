import { RateOracleConfiguredEvent } from '../event-parsers/types';
import { pullRateOracleConfiguredEvent } from '../services/big-query/raw-rate-oracle-configured-table/pull-data/pullMarketConfiguredEvent';
import { insertRateOracleConfiguredEvent } from '../services/big-query/raw-rate-oracle-configured-table/push-data/insertMarketConfiguredEvent';

export const handleRateOracleConfigured = async (
  event: RateOracleConfiguredEvent,
) => {
  const existingEvent = await pullRateOracleConfiguredEvent(event.id);

  if (existingEvent) {
    return;
  }

  await insertRateOracleConfiguredEvent(event);
};
