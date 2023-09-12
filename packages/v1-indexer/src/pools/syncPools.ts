import { getFactory } from '../common/getFactory';
import { getFactoryEvents } from '../common/contract-services/getFactoryEvents';
import { getProvider } from '../common/provider/getProvider';
import {
  getInformationPerChain,
  setRedis,
} from '../common/services/redisService';
import { processIrsInstanceEvent } from './processIrsInstanceEvent';

export const syncPools = async (chainIds: number[]): Promise<void> => {
  const lastProcessedBlocks: { [processId: string]: number } = {};

  for (const chainId of chainIds) {
    const factory = getFactory(chainId.toString());
    const provider = getProvider(chainId);

    const { value: latestBlock, id: processId } = await getInformationPerChain(
      'last_block_pools',
      chainId,
    );

    // const toBlock = await provider.getBlockNumber();
    // const fromBlock = latestBlock + 1;

    const currentBlock = await provider.getBlockNumber();
    const fromBlock = latestBlock + 1;
    const toBlock = Math.min(fromBlock + 1_000_000, currentBlock);

    if (fromBlock >= toBlock) {
      continue;
    }

    lastProcessedBlocks[processId] = toBlock;

    console.log(
      `[Pools, ${chainId}]: Processing between blocks ${fromBlock}-${toBlock}...`,
    );

    const events = await getFactoryEvents(
      factory,
      provider,
      ['irs_pool_deployment'],
      chainId,
      fromBlock,
      toBlock,
    );

    if (events.length === 0) {
      continue;
    }

    for (const event of events) {
      await processIrsInstanceEvent(event);
    }
  }

  // Update Redis

  if (Object.entries(lastProcessedBlocks).length > 0) {
    console.log('[Pools]: Caching to Redis...');
    for (const [processId, lastProcessedBlock] of Object.entries(
      lastProcessedBlocks,
    )) {
      await setRedis(processId, lastProcessedBlock);
    }
  }
};
