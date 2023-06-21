import { getBlockAtTimestamp } from '@voltz-protocol/commons-v2';
import { pullAllPositions } from '../big-query-support/positions-table/pull-data/pullAllPositions';
import { updatePositions } from '../big-query-support/positions-table/push-data/updatePositions';
import { getVammEvents } from '../common/contract-services/getVammEvents';
import {
  MintOrBurnEventInfo,
  SwapEventInfo,
  VAMMPriceChangeEventInfo,
} from '../common/event-parsers/types';
import { getActiveAmms } from '../common/getAmms';
import { getInformationPerVAMM } from '../common/services/redisService';
import { processMintOrBurnEvent } from './processEvents/processMintOrBurnEvent';
import { processSwapEvent } from './processEvents/processSwapEvent';
import { processVAMMPriceChangeEvent } from './processEvents/processVAMMPriceChangeEvent';

export const syncPnL = async (
  chainIds: number[],
  targetTimestamp: number,
): Promise<void> => {
  const lastProcessedTicks: { [poolId: string]: number } = {};

  const currentPositions = await pullAllPositions();

  let promises: Promise<void>[] = [];
  for (const chainId of chainIds) {
    const amms = await getActiveAmms(chainId);

    if (amms.length === 0) {
      continue;
    }

    const fromBlock = 0;
    const toBlock = await getBlockAtTimestamp(chainId, targetTimestamp);

    console.log(`[PnL, ${chainId}]: Processing up to block ${toBlock}...`);

    const chainPromises = amms.map(async (amm) => {
      if (fromBlock >= toBlock) {
        return;
      }

      const events = await getVammEvents(
        amm,
        ['mint', 'burn', 'price_change', 'swap'],
        chainId,
        fromBlock,
        toBlock,
      );

      if (events.length === 0) {
        return;
      }

      const { value: latestTick, id: poolId } = await getInformationPerVAMM(
        'last_tick_pnl',
        chainId,
        amm.vamm,
      );
      lastProcessedTicks[poolId] = latestTick;

      for (let i = 0; i < events.length; i++) {
        const event = events[i];

        switch (event.type) {
          case 'mint':
          case 'burn': {
            processMintOrBurnEvent(
              currentPositions,
              event as MintOrBurnEventInfo,
            );
            break;
          }
          case 'price_change': {
            await processVAMMPriceChangeEvent(
              currentPositions,
              event as VAMMPriceChangeEventInfo,
              lastProcessedTicks[poolId],
            );

            lastProcessedTicks[poolId] = (
              event as VAMMPriceChangeEventInfo
            ).tick;
            break;
          }
          case 'vamm_initialization': {
            lastProcessedTicks[poolId] = (
              event as VAMMPriceChangeEventInfo
            ).tick;
            break;
          }
          case 'swap': {
            await processSwapEvent(currentPositions, event as SwapEventInfo);
            break;
          }
        }
      }
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
  if (currentPositions.length > 0) {
    await updatePositions('[PnL]', currentPositions);
  }
};
