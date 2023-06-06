import { handleCollateralUpdate } from '../event-handlers/handleCollateralUpdate';
import { handleMarketConfigured } from '../event-handlers/handleMarketConfigured';
import { handleMarketFeeConfigured } from '../event-handlers/handleMarketFeeConfigured';
import { handleRateOracleConfigured } from '../event-handlers/handleRateOracleConfigured';
import { handleVammCreated } from '../event-handlers/handleVammCreated';
import { handleVammPriceChange } from '../event-handlers/handleVammPriceChange';
import {
  CollateralUpdateEvent,
  MarketConfiguredEvent,
  MarketFeeConfiguredEvent,
  ProductPositionUpdatedEvent,
  RateOracleConfiguredEvent,
  VammCreatedEvent,
  VammPriceChangeEvent,
} from '@voltz-protocol/commons-v2';
import { fetchEvents } from '../fetch-events/fetchEvents';
import { getProvider } from '../services/provider';
import { handleProductPositionUpdated } from '../event-handlers/handleProductPositionUpdated';

export const sync = async (chainIds: number[]): Promise<void> => {
  for (const chainId of chainIds) {
    const provider = getProvider(chainId);
    const currentBlock = await provider.getBlockNumber();

    console.log(
      `[Protocol indexer, ${chainId}]: Processing up to block ${currentBlock}...`,
    );

    const events = await fetchEvents(
      chainId,
      [
        'collateral-update',
        'market-fee-configured',
        'market-configured',
        'rate-oracle-configured',
        'product-position-updated',
        'vamm-created',
        'vamm-price-change',
      ],
      0,
      currentBlock,
    );

    for (const e of events) {
      switch (e.type) {
        case 'collateral-update': {
          await handleCollateralUpdate(e as CollateralUpdateEvent);
          break;
        }
        case 'vamm-created': {
          await handleVammCreated(e as VammCreatedEvent);
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
        case 'product-position-updated': {
          await handleProductPositionUpdated(e as ProductPositionUpdatedEvent);
          break;
        }
        case 'vamm-price-change': {
          await handleVammPriceChange(e as VammPriceChangeEvent);
          break;
        }
        default: {
          throw new Error(`Unhandled event type`);
        }
      }
    }
  }
};
