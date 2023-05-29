import { getCoreContract } from '../contract-generators/core';
import { parseCollateralUpdate } from '../event-parsers/core/collateralUpdate';
import { ProtocolEvent, ProtocolEventType } from '../event-parsers/types';

export const fetchEvents = async (
  chainId: number,
  eventTypes: ProtocolEventType[],
  fromBlock: number,
  toBlock: number,
): Promise<ProtocolEvent[]> => {
  const allEvents: ProtocolEvent[] = [];
  const coreContract = getCoreContract(chainId);

  if (eventTypes.includes('collateral-update')) {
    const eventFilter = coreContract.filters.CollateralUpdate();

    await coreContract
      .queryFilter(eventFilter, fromBlock, toBlock)
      .then((evmEvents) =>
        evmEvents.map((e) => parseCollateralUpdate(chainId, e)),
      )
      .then((events) => {
        allEvents.push(...events);
      });
  }

  const sortedEvents = allEvents.sort((a, b) => {
    if (a.blockNumber === b.blockNumber) {
      return a.transactionIndex - b.transactionIndex;
    }

    return a.blockNumber - b.blockNumber;
  });

  return sortedEvents;
};
