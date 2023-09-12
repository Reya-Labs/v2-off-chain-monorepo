import { createPoolsTable } from './big-query-support/pools-table/createPoolsTable';
import { syncPools } from './pools/syncPools';
import { indexInactiveTimeInMS } from './global';
import { sleep } from '@voltz-protocol/commons-v2';
import { createProtocolV1Dataset } from './big-query-support/utils';

const chainIds = [1, 5, 42161, 421613, 43114, 43113];

export const main = async () => {
  await createProtocolV1Dataset();
  await createPoolsTable();

  while (true) {
    try {
      await syncPools(chainIds);
    } catch (error) {
      console.log(
        `[Pools]: Loop has failed with message: ${
          (error as Error).message
        }.  It will retry...`,
      );
    }

    if (Date.now() > 1694606400 * 1000) {
      await sleep(indexInactiveTimeInMS);
    }
  }
};

main()
  .then(() => {
    console.log('[Pools]: Execution completed.');
  })
  .catch((error) => {
    console.log(
      `[Pools]: Error encountered. ${(error as unknown as Error).message}`,
    );
  });
