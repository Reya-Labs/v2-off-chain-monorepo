import { insertNewSwaps } from '../big-query-support/active-swaps-table/push-data/insertNewSwaps';
import { getVammEvents } from '../common/contract-services/getVammEvents';
import { SwapEventInfo } from '../common/event-parsers/types';
import { getRecentAmms } from '../common/getAmms';
import { getProvider } from '../common/provider/getProvider';
import {
  getInformationPerVAMM,
  setRedis,
} from '../common/services/redisService';

export const syncSwaps = async (chainIds: number[]): Promise<boolean> => {
  const lastProcessedBlocks: { [processId: string]: number } = {};

  let promises: Promise<void>[] = [];
  const newEvents: SwapEventInfo[] = [];

  let allChainIdsBackfilled = true;

  for (const chainId of chainIds) {
    const amms = await getRecentAmms(chainId);

    if (amms.length === 0) {
      continue;
    }

    const provider = getProvider(chainId);
    const currentBlock = await provider.getBlockNumber();

    console.log(
      `[Swaps, ${chainId}]: Processing up to block ${currentBlock}...`,
    );

    const chainPromises = amms.map(async (amm) => {
      const { value: latestBlock, id: processId } = await getInformationPerVAMM(
        'last_block_active_swaps',
        chainId,
        amm.vamm,
      );

      // const fromBlock = latestBlock + 1;
      // const toBlock = currentBlock;

      const fromBlock = latestBlock + 1;
      const toBlock = Math.min(fromBlock + 1_000_000, currentBlock);
      if (toBlock != currentBlock) {
        allChainIdsBackfilled = false;
      }

      if (fromBlock >= toBlock) {
        return;
      }

      lastProcessedBlocks[processId] = toBlock;

      const events = await getVammEvents(
        amm,
        ['swap'],
        chainId,
        fromBlock,
        toBlock,
      );
      newEvents.push(...(events as SwapEventInfo[]));
    });

    promises = promises.concat(...chainPromises);
  }

  const output = await Promise.allSettled(promises);
  output.forEach((v) => {
    if (v.status === 'rejected') {
      throw v.reason;
    }
  });

  // Push update to BigQuery
  await insertNewSwaps('[Swaps]', newEvents);

  // Update Redis
  if (Object.entries(lastProcessedBlocks).length > 0) {
    console.log('[Swaps]: Caching to Redis...');
    for (const [processId, lastProcessedBlock] of Object.entries(
      lastProcessedBlocks,
    )) {
      await setRedis(processId, lastProcessedBlock);
    }
  }

  return allChainIdsBackfilled;
};
