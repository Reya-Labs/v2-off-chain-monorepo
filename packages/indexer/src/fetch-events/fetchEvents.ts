import { EventFilter } from 'ethers';
import { BaseEvent } from '@voltz-protocol/bigquery-v2';
import {
  exponentialBackoff,
  fetchMultiplePromises,
  getCoreContract,
  getDatedIrsInstrumentContract,
  getDatedIrsVammContract,
} from '@voltz-protocol/commons-v2';
import { parseEvent } from '../event-parsers/parseEvent';
import { getProvider } from '../services/getProvider';

export const fetchEvents = async (
  chainId: number,
  fromBlock: number,
  toBlock: number,
): Promise<BaseEvent[]> => {
  // Fetch all contracts of interest
  const provider = getProvider(chainId);
  const coreContract = getCoreContract(chainId, provider);
  const datedIrsInstrumentContract = getDatedIrsInstrumentContract(
    chainId,
    provider,
  );
  const datedIrsExchangeContract = getDatedIrsVammContract(chainId, provider);

  // Build promises to retrieve all the evm events from target contracts
  const allPromises = [
    exponentialBackoff(() =>
      coreContract.queryFilter('*' as EventFilter, fromBlock, toBlock),
    ),
    exponentialBackoff(() =>
      datedIrsInstrumentContract.queryFilter(
        '*' as EventFilter,
        fromBlock,
        toBlock,
      ),
    ),
    exponentialBackoff(() =>
      datedIrsExchangeContract.queryFilter(
        '*' as EventFilter,
        fromBlock,
        toBlock,
      ),
    ),
  ];

  // Await all promises and require all calls to succeed
  const {
    data: allContractEvents,
    isError,
    error,
  } = await fetchMultiplePromises(allPromises);

  // If there any error, throw it
  if (isError) {
    throw error;
  }

  // Parse all evm events to custom types
  const coreEvents = allContractEvents[0]
    .map((e) => parseEvent('core', chainId, e))
    .filter((e) => e !== null) as BaseEvent[];

  const datedIrsInstrumentEvents = allContractEvents[1]
    .map((e) => parseEvent('dated_irs_instrument', chainId, e))
    .filter((e) => e !== null) as BaseEvent[];

  const datedIrsExchangeEvents = allContractEvents[2]
    .map((e) => parseEvent('dated_irs_vamm', chainId, e))
    .filter((e) => e !== null) as BaseEvent[];

  const allEvents = [
    coreEvents,
    datedIrsInstrumentEvents,
    datedIrsExchangeEvents,
  ].flat();

  // Sort the events chronologically (by blockNumber, transactionIndex and logIndex)
  const sortedEvents = allEvents.sort((a, b) => {
    if (a.blockNumber === b.blockNumber) {
      if (a.transactionIndex === b.transactionIndex) {
        return a.logIndex - b.logIndex;
      }

      return a.transactionIndex - b.transactionIndex;
    }

    return a.blockNumber - b.blockNumber;
  });

  return sortedEvents;
};
