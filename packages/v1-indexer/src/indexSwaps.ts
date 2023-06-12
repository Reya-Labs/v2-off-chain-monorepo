import { authenticateImplicitWithAdc } from '@voltz-protocol/commons-v2';
import { createActiveSwapsTable } from './big-query-support/active-swaps-table/createActiveSwapsTable';
import { sleep } from './common/utils';
import { syncSwaps } from './swaps/syncSwaps';
import { indexInactiveTimeInMS } from './global';

const chainIds = [1, 42161, 43114];

export const main = async () => {
  await authenticateImplicitWithAdc();
  await createActiveSwapsTable();

  while (true) {
    try {
      await syncSwaps(chainIds);
    } catch (error) {
      console.log(
        `[Swaps]: Loop has failed with message: ${
          (error as Error).message
        }.  It will retry...`,
      );
    }

    await sleep(indexInactiveTimeInMS);
  }
};

main()
  .then(() => {
    console.log('[Swaps]: Execution completed.');
  })
  .catch((error) => {
    console.log(
      `[Swaps]: Error encountered. ${(error as unknown as Error).message}`,
    );
  });
