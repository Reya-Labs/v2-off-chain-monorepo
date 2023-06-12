import { authenticateImplicitWithAdc } from '@voltz-protocol/commons-v2';
import { createMintsAndBurnsTable } from './big-query-support/mints-and-burns-table/createMintsAndBurnsTable';
import { sleep } from './common/utils';
import { syncMintsAndBurns } from './mints-and-burns/syncMintsAndBurns';
import { indexInactiveTimeInMS } from './global';

const chainIds = [1, 42161, 43114];

export const main = async () => {
  await authenticateImplicitWithAdc();
  await createMintsAndBurnsTable();

  while (true) {
    try {
      await syncMintsAndBurns(chainIds);
    } catch (error) {
      console.log(
        `[Mints and burns]: Loop has failed with message: ${
          (error as Error).message
        }.  It will retry...`,
      );
    }

    await sleep(indexInactiveTimeInMS);
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
