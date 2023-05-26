import { handleCollateralUpdate } from '../event-handlers/handleCollateralUpdate';
import { handleMarketConfigured } from '../event-handlers/handleMarketConfigured';
import { handleMarketFeeConfigured } from '../event-handlers/handleMarketFeeConfigured';
import { handleRateOracleConfigured } from '../event-handlers/handleRateOracleConfigured';
import {
  CollateralUpdateEvent,
  MarketConfiguredEvent,
  MarketFeeConfiguredEvent,
  RateOracleConfiguredEvent,
} from '../event-parsers/types';
import { fetchEvents } from '../fetch-events/fetchEvents';
import { getProvider } from '../services/provider';

export const sync = async (chainIds: number[]): Promise<void> => {
  for (const chainId of chainIds) {
    const provider = getProvider(chainId);
    const currentBlock = await provider.getBlockNumber();

    console.log(
      `[Protocol indexer, ${chainId}]: Processing up to block ${currentBlock}...`,
    );

    const events = await fetchEvents(
      chainId,
      ['collateral-update'],
      0,
      currentBlock,
    );

    for (const e of events) {
      switch (e.type) {
        case 'collateral-update': {
          await handleCollateralUpdate(e as CollateralUpdateEvent);
          break;
        }
        case 'market-fee-configured': {
          await handleMarketFeeConfigured(e as MarketFeeConfiguredEvent);
          break;
        }
        case 'market-configured': {
          await handleMarketConfigured(e as MarketConfiguredEvent);
          break;
        }
        case 'rate-oracle-configured': {
          await handleRateOracleConfigured(e as RateOracleConfiguredEvent);
          break;
        }
        default: {
          throw new Error(`Unhandled event type`);
        }
      }
    }
  }
};
