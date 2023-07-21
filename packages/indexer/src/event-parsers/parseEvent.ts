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
import { log } from '../logging/log';
import { parseTakerOrder } from './parseTakerOrder';
import { parseDeposited } from './parseDeposited';
import { parseWithdrawal } from './parseWithdrawal';
import { parseDatedIRSPositionSettled } from './parseDatedIRSPositionSettled';
import { parseVammConfigUpdated } from './parseVammConfigUpdated';

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
        case 'Deposited': {
          return parseDeposited(chainId, event);
        }
        case 'Withdrawn': {
          return parseWithdrawal(chainId, event);
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
          if (event.event === undefined) {
            log(`Unmapped event from Core.`, ['unmapped-events']);
          } else {
            log(`Unparsed event ${event.event} from Core.`, [
              'unparsed-events',
            ]);
          }
          return null;
        }
      }
    }

    case 'dated_irs_instrument': {
      switch (event.event) {
        case 'DatedIRSPositionSettled': {
          return parseDatedIRSPositionSettled(chainId, event);
        }
        case 'MarketConfigured': {
          return parseMarketConfigured(chainId, event);
        }
        case 'ProductPositionUpdated': {
          return parseProductPositionUpdated(chainId, event);
        }
        case 'RateOracleConfigured': {
          return parseRateOracleConfigured(chainId, event);
        }
        case 'TakerOrder': {
          return parseTakerOrder(chainId, event);
        }
        default: {
          if (event.event === undefined) {
            log(`Unmapped event from Instrument.`, ['unmapped-events']);
          } else {
            log(`Unparsed event ${event.event} from Instrument.`, [
              'unparsed-events',
            ]);
          }
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
        case 'VAMMPriceChange': {
          return parseVammPriceChange(chainId, event);
        }
        case 'VammConfigUpdated': {
          if (event.args?.maturityTimestamp === undefined) {
            return null;
          }
          return parseVammConfigUpdated(chainId, event);
        }
        default: {
          if (event.event === undefined) {
            log(`Unmapped event from VAMM.`, ['unmapped-events']);
          } else {
            log(`Unparsed event ${event.event} from VAMM.`, [
              'unparsed-events',
            ]);
          }
          return null;
        }
      }
    }

    default: {
      throw new Error(`Unsupported contract type: ${contract}`);
    }
  }
};
