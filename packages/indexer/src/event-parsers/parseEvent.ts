import { Event } from 'ethers';
import { BaseEvent } from '@voltz-protocol/bigquery-v2';
import { parseAccountCreated } from './parseAccountCreated';
import { parseAccountOwnerUpdate } from './parseAccountOwnerUpdate';
import { parseCollateralConfigured } from './parseCollateralConfigured';
import { parseCollateralUpdate } from './parseCollateralUpdate';
import { parseLiquidation } from './parseLiquidation';
import { parseMarketFeeConfigured } from './parseMarketFeeConfigured';
import { parseProductRegistered } from './parseProductRegistered';
import { parseMarketConfigured } from './parseMarketConfigured';
import { parseProductPositionUpdated } from './parseProductPositionUpdated';
import { parseRateOracleConfigured } from './parseRateOracleConfigured';
import { parseLiquidityChange } from './parseLiquidityChange';
import { parseVammCreated } from './parseVammCreated';
import { parseVammPriceChange } from './parseVammPriceChange';

export const parseEvent = (
  contract: 'core' | 'dated_irs_instrument' | 'dated_irs_vamm',
  chainId: number,
  event: Event,
): BaseEvent | null => {
  switch (contract) {
    case 'core': {
      switch (event.event) {
        case 'AccountCreated': {
          return parseAccountCreated(chainId, event);
        }
        case 'AccountOwnerUpdate': {
          return parseAccountOwnerUpdate(chainId, event);
        }
        case 'CollateralConfigured': {
          return parseCollateralConfigured(chainId, event);
        }
        case 'CollateralUpdate': {
          return parseCollateralUpdate(chainId, event);
        }
        case 'Liquidation': {
          return parseLiquidation(chainId, event);
        }
        case 'MarketFeeConfigured': {
          return parseMarketFeeConfigured(chainId, event);
        }
        case 'ProductRegistered': {
          return parseProductRegistered(chainId, event);
        }
        default: {
          console.log(`Unmapped event ${event.event} from Core.`);
          return null;
        }
      }
    }

    case 'dated_irs_instrument': {
      switch (event.event) {
        case 'MarketConfigured': {
          return parseMarketConfigured(chainId, event);
        }
        case 'ProductPositionUpdated': {
          return parseProductPositionUpdated(chainId, event);
        }
        case 'RateOracleConfigured': {
          return parseRateOracleConfigured(chainId, event);
        }
        default: {
          console.log(`Unmapped event ${event.event} from Instrument.`);
          return null;
        }
      }
    }

    case 'dated_irs_vamm': {
      switch (event.event) {
        case 'LiquidityChange': {
          return parseLiquidityChange(chainId, event);
        }
        case 'VammCreated': {
          return parseVammCreated(chainId, event);
        }
        case 'VammPriceChange': {
          return parseVammPriceChange(chainId, event);
        }
        default: {
          return null;
        }
      }
    }

    default: {
      throw new Error(`Unsupported contract type: ${contract}`);
    }
  }
};
