import { ethers } from 'ethers';

import { parseIrsInstanceEvent } from '../event-parsers/parseIrsInstanceEvent';
import { FactoryEventInfo, FactoryEventType } from '../types';
import { generateFactoryContract } from './generateFactoryContract';

export const getFactoryEvents = async (
  factory: string,
  provider: ethers.providers.Provider,
  eventTypes: FactoryEventType[],
  chainId: number,
  fromBlock: number,
  toBlock: number,
): Promise<FactoryEventInfo[]> => {
  const allEvents: FactoryEventInfo[] = [];
  const factoryContract = generateFactoryContract(factory, provider);

  if (eventTypes.includes('irs_pool_deployment')) {
    const eventFilter = factoryContract.filters.IrsInstance();
    const events = await factoryContract.queryFilter(
      eventFilter,
      fromBlock,
      toBlock,
    );

    const extendedEvents = events.map((event) =>
      parseIrsInstanceEvent(event, chainId),
    );

    allEvents.push(...extendedEvents);
  }

  const sortedEvents = allEvents.sort((a, b) => {
    if (a.blockNumber === b.blockNumber) {
      return a.transactionIndex - b.transactionIndex;
    }

    return a.blockNumber - b.blockNumber;
  });

  return sortedEvents;
};
