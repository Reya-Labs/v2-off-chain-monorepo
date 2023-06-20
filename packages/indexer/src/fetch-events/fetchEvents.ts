import { EventFilter } from 'ethers';
import { BaseEvent } from '@voltz-protocol/bigquery-v2';
import {
  getCoreContract,
  getDatedIrsInstrumentContract,
  getDatedIrsVammContract,
  isNull,
} from '@voltz-protocol/commons-v2';
import { parseEvent } from '../event-parsers/parseEvent';

export const fetchEvents = async (
  chainId: number,
  fromBlock: number,
  toBlock: number,
): Promise<BaseEvent[]> => {
  const coreContract = getCoreContract(chainId);
  const datedIrsInstrumentContract = getDatedIrsInstrumentContract(chainId);
  const datedIrsExchangeContract = getDatedIrsVammContract(chainId);

  const allPromises = [
    coreContract.queryFilter('*' as EventFilter, fromBlock, toBlock),
    datedIrsInstrumentContract.queryFilter(
      '*' as EventFilter,
      fromBlock,
      toBlock,
    ),
    datedIrsExchangeContract.queryFilter(
      '*' as EventFilter,
      fromBlock,
      toBlock,
    ),
  ];

  const responses = await Promise.allSettled(allPromises);

  const allContractEvents = responses.map((r) => {
    if (r.status === 'rejected') {
      throw new Error(`Fetching event failed with ${r.reason}`);
    }
    return r.value;
  });

  const coreEvents = allContractEvents[0]
    .map((e) => parseEvent('core', chainId, e))
    .filter((e) => !isNull(e)) as BaseEvent[];

  const datedIrsInstrumentEvents = allContractEvents[1]
    .map((e) => parseEvent('dated_irs_instrument', chainId, e))
    .filter((e) => !isNull(e)) as BaseEvent[];

  const datedIrsExchangeEvents = allContractEvents[2]
    .map((e) => parseEvent('dated_irs_vamm', chainId, e))
    .filter((e) => !isNull(e)) as BaseEvent[];

  const allEvents = [
    coreEvents,
    datedIrsInstrumentEvents,
    datedIrsExchangeEvents,
  ].flat();

  const sortedEvents = allEvents.sort((a, b) => {
    if (a.blockNumber === b.blockNumber) {
      return a.transactionIndex - b.transactionIndex;
    }

    return a.blockNumber - b.blockNumber;
  });

  return sortedEvents;
};
