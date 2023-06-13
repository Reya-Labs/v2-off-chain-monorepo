import { fetchEvents } from '../fetch-events/fetchEvents';
import { handleEvent } from '../event-handlers/handleEvent';
import { getProvider } from '@voltz-protocol/commons-v2';

export const sync = async (chainIds: number[]): Promise<void> => {
  for (const chainId of chainIds) {
    const provider = getProvider(chainId);
    const currentBlock = await provider.getBlockNumber();

    console.log(
      `[Protocol indexer, ${chainId}]: Processing up to block ${currentBlock}...`,
    );

    const events = await fetchEvents(chainId, 0, currentBlock);

    for (const e of events) {
      await handleEvent(e);
    }
  }
};
