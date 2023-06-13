import { Event, Contract } from 'ethers';
import { parseCollateralUpdate } from '../event-parsers/parseCollateralUpdate';
import { parseMarketFeeConfigured } from '../event-parsers/parseMarketFeeConfigured';
import { parseMarketConfigured } from '../event-parsers/parseMarketConfigured';
import { parseProductPositionUpdated } from '../event-parsers/parseProductPositionUpdated';
import { parseRateOracleConfigured } from '../event-parsers/parseRateOracleConfigured';
import { parseVammCreated } from '../event-parsers/parseVammCreated';
import { parseVammPriceChange } from '../event-parsers/parseVammPriceChange';
import { BaseEvent } from '@voltz-protocol/bigquery-v2';
import { parseAccountCreated } from '../event-parsers/parseAccountCreated';
import { parseAccountOwnerUpdate } from '../event-parsers/parseAccountOwnerUpdate';
import { parseCollateralConfigured } from '../event-parsers/parseCollateralConfigured';
import { parseLiquidation } from '../event-parsers/parseLiquidation';
import { parseProductRegistered } from '../event-parsers/parseProductRegistered';
import { parseLiquidityChange } from '../event-parsers/parseLiquidityChange';
import { parseMakerOrder } from '../event-parsers/parseMakerOrder';
import { parseTakerOrder } from '../event-parsers/parseTakerOrder';
import {
  getCoreContract,
  getDatedIrsInstrumentContract,
  getDatedIrsVammContract,
} from '@voltz-protocol/commons-v2';

export const fetchEvents = async (
  chainId: number,
  fromBlock: number,
  toBlock: number,
): Promise<BaseEvent[]> => {
  const fetchSpecificEvents = async <T>(
    contract: Contract,
    eventName: string,
    parser: (chainId: number, e: Event) => T,
  ): Promise<T[]> => {
    const eventFilter = contract.filters[eventName]();

    const events = await contract.queryFilter(eventFilter, fromBlock, toBlock);
    const parsedEvents = events.map((e) => parser(chainId, e));

    return parsedEvents;
  };

  const coreContract = getCoreContract(chainId);
  const datedIrsInstrumentContract = getDatedIrsInstrumentContract(chainId);
  const datedIrsExchangeContract = getDatedIrsVammContract(chainId);

  const allPromises = [
    // core
    fetchSpecificEvents(coreContract, 'AccountCreated', parseAccountCreated),

    fetchSpecificEvents(
      coreContract,
      'AccountOwnerUpdate',
      parseAccountOwnerUpdate,
    ),

    fetchSpecificEvents(
      coreContract,
      'CollateralConfigured',
      parseCollateralConfigured,
    ),

    fetchSpecificEvents(
      coreContract,
      'CollateralUpdate',
      parseCollateralUpdate,
    ),

    fetchSpecificEvents(coreContract, 'Liquidation', parseLiquidation),

    fetchSpecificEvents(
      coreContract,
      'MarketFeeConfigured',
      parseMarketFeeConfigured,
    ),

    fetchSpecificEvents(
      coreContract,
      'ProductRegistered',
      parseProductRegistered,
    ),

    // product
    fetchSpecificEvents(
      datedIrsInstrumentContract,
      'MarketConfigured',
      parseMarketConfigured,
    ),

    fetchSpecificEvents(
      datedIrsInstrumentContract,
      'ProductPositionUpdated',
      parseProductPositionUpdated,
    ),

    fetchSpecificEvents(
      datedIrsInstrumentContract,
      'RateOracleConfigured',
      parseRateOracleConfigured,
    ),

    // exchange
    fetchSpecificEvents(
      datedIrsExchangeContract,
      'LiquidityChange',
      parseLiquidityChange,
    ),

    fetchSpecificEvents(
      datedIrsExchangeContract,
      'MakerOrder',
      parseMakerOrder,
    ),

    fetchSpecificEvents(
      datedIrsExchangeContract,
      'TakerOrder',
      parseTakerOrder,
    ),

    fetchSpecificEvents(
      datedIrsExchangeContract,
      'VammCreated',
      parseVammCreated,
    ),

    fetchSpecificEvents(
      datedIrsExchangeContract,
      'VammPriceChange',
      parseVammPriceChange,
    ),
  ];

  const responses = await Promise.allSettled(allPromises);

  const allEvents = responses
    .map((r) => {
      if (r.status === 'rejected') {
        throw new Error(`Fetching event failed with ${r.reason}`);
      }
      return r.value;
    })
    .flat();

  const sortedEvents = allEvents.sort((a, b) => {
    if (a.blockNumber === b.blockNumber) {
      return a.transactionIndex - b.transactionIndex;
    }

    return a.blockNumber - b.blockNumber;
  });

  return sortedEvents;
};
