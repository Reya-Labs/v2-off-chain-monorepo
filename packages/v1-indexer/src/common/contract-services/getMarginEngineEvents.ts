import { BigQueryPoolRow } from '../../big-query-support/types';
import { parseMarginUpdateEvent } from '../event-parsers/parseMarginUpdateEvent';
import { getProvider } from '../provider/getProvider';
import { MarginEngineEventInfo, MarginEngineEventType } from '../types';
import { generateMarginEngineContract } from './generateMarginEngineContract';

export const getMarginEngineEvents = async (
  amm: BigQueryPoolRow,
  eventTypes: MarginEngineEventType[],
  chainId: number,
  fromBlock: number,
  toBlock: number,
): Promise<MarginEngineEventInfo[]> => {
  const allEvents: MarginEngineEventInfo[] = [];
  const provider = getProvider(chainId);
  const marginEngineContract = generateMarginEngineContract(
    amm.marginEngine,
    provider,
  );

  if (eventTypes.includes('margin_update')) {
    const eventFilter = marginEngineContract.filters.PositionMarginUpdate();
    const events = await marginEngineContract.queryFilter(
      eventFilter,
      fromBlock,
      toBlock,
    );

    const extendedEvents = events.map((event) =>
      parseMarginUpdateEvent(event, amm, chainId),
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
