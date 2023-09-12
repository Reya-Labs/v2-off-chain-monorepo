import { insertNewMintOrBurns } from '../big-query-support/mints-and-burns-table/push-data/insertNewMintOrBurns';
import { getVammEvents } from '../common/contract-services/getVammEvents';
import { MintOrBurnEventInfo } from '../common/event-parsers/types';
import { getRecentAmms } from '../common/getAmms';
import { getProvider } from '../common/provider/getProvider';
import {
  getInformationPerVAMM,
  setRedis,
} from '../common/services/redisService';

export const syncMintsAndBurns = async (chainIds: number[]): Promise<void> => {
  const lastProcessedBlocks: { [processId: string]: number } = {};

  const promises: Promise<void>[] = [];
  const newEvents: MintOrBurnEventInfo[] = [];

  for (const chainId of chainIds) {
    const amms = await getRecentAmms(chainId);

    if (amms.length === 0) {
      continue;
    }

    const provider = getProvider(chainId);
    const currentBlock = await provider.getBlockNumber();

    console.log(
      `[Mint and burns, ${chainId}]: Processing up to block ${currentBlock}...`,
    );

    const chainPromises = amms.map(async (amm) => {
      const { value: latestBlock, id: processId } = await getInformationPerVAMM(
        'last_block_mints_and_burns',
        chainId,
        amm.vamm,
      );

      // const fromBlock = latestBlock + 1;
      // const toBlock = currentBlock;

      const fromBlock = latestBlock + 1;
      const toBlock = Math.min(fromBlock + 1_000_000, currentBlock);

      if (fromBlock >= toBlock) {
        return;
      }

      lastProcessedBlocks[processId] = toBlock;

      const events = await getVammEvents(
        amm,
        ['mint', 'burn'],
        chainId,
        fromBlock,
        toBlock,
      );
      newEvents.push(...(events as MintOrBurnEventInfo[]));
    });

    promises.push(...chainPromises);
  }
  const output = await Promise.allSettled(promises);
  output.forEach((v) => {
    if (v.status === 'rejected') {
      throw v.reason;
    }
  });

  // Push update to BigQuery
  await insertNewMintOrBurns('[Mints and burns]', newEvents);

  // Update Redis

  if (Object.entries(lastProcessedBlocks).length > 0) {
    console.log('[Mints and burns]: Caching to Redis...');
    for (const [processId, lastProcessedBlock] of Object.entries(
      lastProcessedBlocks,
    )) {
      await setRedis(processId, lastProcessedBlock);
    }
  }
};
