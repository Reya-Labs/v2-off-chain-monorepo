import { sleep } from '@voltz-protocol/commons-v2';
import { createMarginUpdatesTable } from './big-query-support/margin-updates-table/createActiveSwapsTable';
import { indexInactiveTimeInMS } from './global';
import { syncMarginUpdates } from './margin-updates/syncMarginUpdate';
import { createProtocolV1Dataset } from './big-query-support/utils';

const chainIds = [1, 42161, 43114];

export const main = async () => {
  await createProtocolV1Dataset();
  await createMarginUpdatesTable();

  while (true) {
    let allChainIdsBackfilled = true;
    try {
      allChainIdsBackfilled = await syncMarginUpdates(chainIds);
    } catch (error) {
      console.log(
        `[Margin Updates]: Loop has failed with message: ${
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
    console.log('[Margin Updates]: Execution completed.');
  })
  .catch((error) => {
    console.log(
      `[Margin Updates]: Error encountered. ${
        (error as unknown as Error).message
      }`,
    );
  });
