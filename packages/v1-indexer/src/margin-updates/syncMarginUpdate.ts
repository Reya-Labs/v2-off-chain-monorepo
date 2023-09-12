import { insertNewMarginUpdates } from '../big-query-support/margin-updates-table/push-data/insertNewMarginUpdates';
import { getMarginEngineEvents } from '../common/contract-services/getMarginEngineEvents';
import { getRecentAmms } from '../common/getAmms';
import { getProvider } from '../common/provider/getProvider';
import {
  getInformationPerMarginEngine,
  setRedis,
} from '../common/services/redisService';
import { MarginEngineEventInfo } from '../common/types';

export const syncMarginUpdates = async (chainIds: number[]): Promise<void> => {
  const lastProcessedBlocks: { [processId: string]: number } = {};

  let promises: Promise<void>[] = [];
  const newEvents: MarginEngineEventInfo[] = [];

  for (const chainId of chainIds) {
    const amms = await getRecentAmms(chainId);

    if (amms.length === 0) {
      continue;
    }

    const provider = getProvider(chainId);
    const currentBlock = await provider.getBlockNumber();

    console.log(
      `[Margin Updates, ${chainId}]: Processing up to block ${currentBlock}...`,
    );

    const chainPromises = amms.map(async (amm) => {
      const { value: latestBlock, id: processId } =
        await getInformationPerMarginEngine(
          'last_block_margin_updates',
          chainId,
          amm.marginEngine,
        );

      // const fromBlock = latestBlock + 1;
      // const toBlock = currentBlock;

      const fromBlock = latestBlock + 1;
      const toBlock = Math.min(fromBlock + 1_000_000, currentBlock);

      if (fromBlock >= toBlock) {
        return;
      }

      lastProcessedBlocks[processId] = toBlock;

      const events = await getMarginEngineEvents(
        amm,
        ['margin_update'],
        chainId,
        fromBlock,
        toBlock,
      );

      newEvents.push(...events);
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
  await insertNewMarginUpdates('[Margin Updates]', newEvents);

  // Update Redis

  if (Object.entries(lastProcessedBlocks).length > 0) {
    console.log('[Margin Updates]: Caching to Redis...');
    for (const [processId, lastProcessedBlock] of Object.entries(
      lastProcessedBlocks,
    )) {
      await setRedis(processId, lastProcessedBlock);
    }
  }
};
