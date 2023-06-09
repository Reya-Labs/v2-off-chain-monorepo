import {
  BaseEvent,
  CollateralUpdateEvent,
  MarketConfiguredEvent,
  MarketFeeConfiguredEvent,
  ProductPositionUpdatedEvent,
  ProtocolEventType,
  RateOracleConfiguredEvent,
  VammCreatedEvent,
  VammPriceChangeEvent,
} from '@voltz-protocol/commons-v2';
import { handleCollateralUpdate } from './handleCollateralUpdate';
import { handleMarketConfigured } from './handleMarketConfigured';
import { handleMarketFeeConfigured } from './handleMarketFeeConfigured';
import { handleProductPositionUpdated } from './handleProductPositionUpdated';
import { handleRateOracleConfigured } from './handleRateOracleConfigured';
import { handleVammCreated } from './handleVammCreated';
import { handleVammPriceChange } from './handleVammPriceChange';

export const handleEvent = async (e: BaseEvent) => {
  switch (e.type) {
    case ProtocolEventType.collateral_update: {
      await handleCollateralUpdate(e as CollateralUpdateEvent);
      break;
    }
    case ProtocolEventType.vamm_created: {
      await handleVammCreated(e as VammCreatedEvent);
      break;
    }
    case ProtocolEventType.market_fee_configured: {
      await handleMarketFeeConfigured(e as MarketFeeConfiguredEvent);
      break;
    }
    case ProtocolEventType.market_configured: {
      await handleMarketConfigured(e as MarketConfiguredEvent);
      break;
    }
    case ProtocolEventType.rate_oracle_configured: {
      await handleRateOracleConfigured(e as RateOracleConfiguredEvent);
      break;
    }
    case ProtocolEventType.product_position_updated: {
      await handleProductPositionUpdated(e as ProductPositionUpdatedEvent);
      break;
    }
    case ProtocolEventType.vamm_price_change: {
      await handleVammPriceChange(e as VammPriceChangeEvent);
      break;
    }
    default: {
      throw new Error(`Unhandled event type`);
    }
  }
};
