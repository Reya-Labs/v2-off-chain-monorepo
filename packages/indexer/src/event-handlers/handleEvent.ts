import {
  AccountCreatedEvent,
  AccountOwnerUpdateEvent,
  BaseEvent,
  CollateralUpdateEvent,
  LiquidityChangeEvent,
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
import { handleAccountCreated } from './handleAccountCreated';
import { handleAccountOwnerUpdate } from './handleAccountOwnerUpdate';
import { handleLiquidityChange } from './handleLiquidityChange';

export const handleEvent = async (e: BaseEvent) => {
  console.log(`Handling ${e.type}...`);
  const start = Date.now().valueOf();

  switch (e.type) {
    // core
    case ProtocolEventType.account_created: {
      await handleAccountCreated(e as AccountCreatedEvent);
      break;
    }

    case ProtocolEventType.account_owner_update: {
      await handleAccountOwnerUpdate(e as AccountOwnerUpdateEvent);
      break;
    }

    case ProtocolEventType.collateral_configured: {
      // todo: add handler
      break;
    }

    case ProtocolEventType.collateral_update: {
      await handleCollateralUpdate(e as CollateralUpdateEvent);
      break;
    }

    case ProtocolEventType.liquidation: {
      // todo: add handler
      break;
    }

    case ProtocolEventType.market_fee_configured: {
      await handleMarketFeeConfigured(e as MarketFeeConfiguredEvent);
      break;
    }

    case ProtocolEventType.product_registered: {
      // todo: add handler
      break;
    }

    // product
    case ProtocolEventType.market_configured: {
      await handleMarketConfigured(e as MarketConfiguredEvent);
      break;
    }

    case ProtocolEventType.product_position_updated: {
      await handleProductPositionUpdated(e as ProductPositionUpdatedEvent);
      break;
    }

    case ProtocolEventType.rate_oracle_configured: {
      await handleRateOracleConfigured(e as RateOracleConfiguredEvent);
      break;
    }

    // exchange
    case ProtocolEventType.liquidity_change: {
      await handleLiquidityChange(e as LiquidityChangeEvent);
      break;
    }

    case ProtocolEventType.maker_order: {
      // todo: add handler
      break;
    }

    case ProtocolEventType.taker_order: {
      // todo: add handler
      break;
    }

    case ProtocolEventType.vamm_created: {
      await handleVammCreated(e as VammCreatedEvent);
      break;
    }

    case ProtocolEventType.vamm_price_change: {
      await handleVammPriceChange(e as VammPriceChangeEvent);
      break;
    }

    default: {
      // todo: review below
      //e.type satisfies never;
      throw new Error(`Unhandled event type ${e.type}`);
    }
  }

  const duration = Math.round((Date.now().valueOf() - start) / 1000);
  console.log(`Handled ${e.type} in ${duration} s.`);
};
