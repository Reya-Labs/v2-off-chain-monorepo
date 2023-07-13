import { fetchEvents } from '../fetch-events/fetchEvents';
import { handleEvent } from '../event-handlers/handleEvent';
import { getNextIndexingBlock, setRedis } from '../services/redis';
import { log } from '../logging/log';
import { getProvider } from '../services/getProvider';
import { exponentialBackoff } from '@voltz-protocol/commons-v2';

export const sync = async (chainIds: number[]): Promise<void> => {
  for (const chainId of chainIds) {
    // Retrieve the block where to pick indexing up from
    const { id: redisKey, value: nextIndexingBlock } =
      await getNextIndexingBlock(chainId);

    // Retrieve the current block
    const provider = getProvider(chainId);
    const currentBlock = await exponentialBackoff(() =>
      provider.getBlockNumber(),
    );

    // Check if any new block has been created meanwhile
    if (nextIndexingBlock > currentBlock) {
      continue;
    }

    // Log
    log(
      `[Protocol indexer, ${chainId}]: Processing between blocks [${nextIndexingBlock}, ${currentBlock}]...`,
    );

    // Fetch all the events of interest between the blocks
    const events = await fetchEvents(chainId, nextIndexingBlock, currentBlock);

    // Handle event one by one
    for (const e of events) {
      await handleEvent(e);
    }

    // Store to redis the next block where to pick indexing up from
    await setRedis(redisKey, currentBlock + 1);
  }
};
