import { Event, Contract } from 'ethers';
import { getCoreContract } from '../contract-generators/core';
import { getDatedIrsInstrumentContract } from '../contract-generators/dated-irs-instrument';
import { getDatedIrsVammContract } from '../contract-generators/dated-irs-vamm';
import { parseCollateralUpdate } from '../event-parsers/core/collateralUpdate';
import { parseMarketFeeConfigured } from '../event-parsers/core/marketFeeConfigured';
import { parseMarketConfigured } from '../event-parsers/dated-irs-instrument/marketConfigured';
import { parseProductPositionUpdated } from '../event-parsers/dated-irs-instrument/productPositionUpdated';
import { parseRateOracleConfigured } from '../event-parsers/dated-irs-instrument/rateOracleConfigured';
import { parseVammCreated } from '../event-parsers/dated-irs-vamm/vammCreated';
import { parseVammPriceChange } from '../event-parsers/dated-irs-vamm/vammPriceChange';
import { BaseEvent } from '@voltz-protocol/commons-v2';

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

    const events = await contract
      .queryFilter(eventFilter, fromBlock, toBlock)
      .then((evmEvents) => evmEvents.map((e) => parser(chainId, e)));

    return events;
  };

  const coreContract = getCoreContract(chainId);
  const datedIrsInstrumentContract = getDatedIrsInstrumentContract(chainId);
  const datedIrsExchangeContract = getDatedIrsVammContract(chainId);

  const allPromises = [
    fetchSpecificEvents(
      coreContract,
      'CollateralUpdate',
      parseCollateralUpdate,
    ),

    fetchSpecificEvents(
      coreContract,
      'MarketFeeConfigured',
      parseMarketFeeConfigured,
    ),

    fetchSpecificEvents(
      datedIrsInstrumentContract,
      'MarketConfigured',
      parseMarketConfigured,
    ),

    fetchSpecificEvents(
      datedIrsInstrumentContract,
      'RateOracleConfigured',
      parseRateOracleConfigured,
    ),

    fetchSpecificEvents(
      datedIrsInstrumentContract,
      'ProductPositionUpdated',
      parseProductPositionUpdated,
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
