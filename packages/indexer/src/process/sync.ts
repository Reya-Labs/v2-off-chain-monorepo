import { fetchEvents } from '../fetch-events/fetchEvents';
import { handleEvent } from '../event-handlers/handleEvent';
import { getProvider } from '@voltz-protocol/commons-v2';
import { getNextIndexingBlock, setRedis } from '../services/redis';

export const sync = async (chainIds: number[]): Promise<void> => {
  for (const chainId of chainIds) {
    const { id: redisKey, value: nextIndexingBlock } =
      await getNextIndexingBlock(chainId);

    const provider = getProvider(chainId);
    const currentBlock = await provider.getBlockNumber();

    console.log(
      `[Protocol indexer, ${chainId}]: Processing between blocks [${nextIndexingBlock}, ${currentBlock}]...`,
    );

    const events = await fetchEvents(chainId, nextIndexingBlock, currentBlock);

    for (const e of events) {
      await handleEvent(e);
    }

    await setRedis(redisKey, currentBlock + 1);
  }
};
