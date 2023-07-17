import {
  AccountCreatedEvent,
  AccountOwnerUpdateEvent,
  BaseEvent,
  CollateralUpdateEvent,
  DatedIRSPositionSettledEvent,
  DepositedWithdrawnEvent,
  LiquidationEvent,
  LiquidityChangeEvent,
  MarketConfiguredEvent,
  MarketFeeConfiguredEvent,
  ProductPositionUpdatedEvent,
  ProtocolEventType,
  RateOracleConfiguredEvent,
  TakerOrderEvent,
  VammCreatedEvent,
  VammPriceChangeEvent,
} from '@voltz-protocol/bigquery-v2';
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
import { log } from '../logging/log';
import { handleDepositedWithdrawn } from './handleDepositedWithdrawn';
import { handleLiquidation } from './handleLiquidation';
import { handleDatedIRSPositionSettled } from './handleDatedIRSPositionSettled';
import { handleTakerOrder } from './handleTakerOrder';

export const handleEvent = async (e: BaseEvent) => {
  log(`Handling ${e.type}...`);
  const start = Date.now().valueOf();

  switch (e.type) {
    // core
    case ProtocolEventType.AccountCreated: {
      await handleAccountCreated(e as AccountCreatedEvent);
      break;
    }

    case ProtocolEventType.AccountOwnerUpdate: {
      await handleAccountOwnerUpdate(e as AccountOwnerUpdateEvent);
      break;
    }

    case ProtocolEventType.CollateralConfigured: {
      // todo: add handler
      break;
    }

    case ProtocolEventType.CollateralUpdate: {
      await handleCollateralUpdate(e as CollateralUpdateEvent);
      break;
    }

    case ProtocolEventType.DepositedWithdrawn: {
      await handleDepositedWithdrawn(e as DepositedWithdrawnEvent);
      break;
    }

    case ProtocolEventType.Liquidation: {
      await handleLiquidation(e as LiquidationEvent);
      break;
    }

    case ProtocolEventType.MarketFeeConfigured: {
      await handleMarketFeeConfigured(e as MarketFeeConfiguredEvent);
      break;
    }

    case ProtocolEventType.ProductRegistered: {
      // todo: add handler
      break;
    }

    // product
    case ProtocolEventType.DatedIRSPositionSettled: {
      await handleDatedIRSPositionSettled(e as DatedIRSPositionSettledEvent);
      break;
    }

    case ProtocolEventType.MarketConfigured: {
      await handleMarketConfigured(e as MarketConfiguredEvent);
      break;
    }

    case ProtocolEventType.ProductPositionUpdated: {
      await handleProductPositionUpdated(e as ProductPositionUpdatedEvent);
      break;
    }

    case ProtocolEventType.RateOracleConfigured: {
      await handleRateOracleConfigured(e as RateOracleConfiguredEvent);
      break;
    }

    case ProtocolEventType.TakerOrder: {
      await handleTakerOrder(e as TakerOrderEvent);
      break;
    }

    // exchange
    case ProtocolEventType.LiquidityChange: {
      await handleLiquidityChange(e as LiquidityChangeEvent);
      break;
    }

    case ProtocolEventType.VammConfigUpdated: {
      // todo: add handler
      break;
    }

    case ProtocolEventType.VammCreated: {
      await handleVammCreated(e as VammCreatedEvent);
      break;
    }

    case ProtocolEventType.VAMMPriceChange: {
      await handleVammPriceChange(e as VammPriceChangeEvent);
      break;
    }

    default: {
      e.type satisfies never;
      throw new Error(`Unhandled event type ${e.type}`);
    }
  }

  const duration = Math.round((Date.now().valueOf() - start) / 1000);
  log(`Handled ${e.type} in ${duration} s.`);
};
