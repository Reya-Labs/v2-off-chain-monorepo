import { createMintsAndBurnsTable } from './big-query-support/mints-and-burns-table/createMintsAndBurnsTable';
import { syncMintsAndBurns } from './mints-and-burns/syncMintsAndBurns';
import { indexInactiveTimeInMS } from './global';
import { sleep } from '@voltz-protocol/commons-v2';
import { createProtocolV1Dataset } from './big-query-support/utils';

const chainIds = [1, 42161, 43114];

export const main = async () => {
  await createProtocolV1Dataset();
  await createMintsAndBurnsTable();

  while (true) {
    let allChainIdsBackfilled = true;
    try {
      allChainIdsBackfilled = await syncMintsAndBurns(chainIds);
    } catch (error) {
      console.log(
        `[Mints and burns]: Loop has failed with message: ${
          (error as Error).message
        }.  It will retry...`,
      );
    }

    if (allChainIdsBackfilled) {
      await sleep(indexInactiveTimeInMS);
    }
  }
};

main()
  .then(() => {
    console.log('[Mints and burns]: Execution completed.');
  })
  .catch((error) => {
    console.log(
      `[Mints and burns]: Error encountered. ${
        (error as unknown as Error).message
      }`,
    );
  });
