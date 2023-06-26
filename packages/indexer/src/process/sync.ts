import { fetchEvents } from '../fetch-events/fetchEvents';
import { handleEvent } from '../event-handlers/handleEvent';
import { getNextIndexingBlock, setRedis } from '../services/redis';
import { log } from '../logging/log';
import { getProvider } from '../services/getProvider';

export const sync = async (chainIds: number[]): Promise<void> => {
  for (const chainId of chainIds) {
    const { id: redisKey, value: nextIndexingBlock } =
      await getNextIndexingBlock(chainId);

    const provider = getProvider(chainId);
    const currentBlock = await provider.getBlockNumber();

    log(
      `[Protocol indexer, ${chainId}]: Processing between blocks [${nextIndexingBlock}, ${currentBlock}]...`,
    );

    const events = await fetchEvents(chainId, nextIndexingBlock, currentBlock);

    for (const e of events) {
      await handleEvent(e);
    }

    await setRedis(redisKey, currentBlock + 1);
  }
};
