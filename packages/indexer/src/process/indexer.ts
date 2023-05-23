import { authenticateImplicitWithAdc } from '../services/big-query/client';
import { createTable } from '../services/big-query/create-tables/createTable';
import { sleep } from '../utils/utils';
import { CHAIN_IDS, INDEXING_BUFFER } from './constants';
import { sync } from './sync';

export const main = async () => {
  await authenticateImplicitWithAdc();
  await createTable('collateral_updates');

  while (true) {
    try {
      await sync(CHAIN_IDS);
    } catch (error) {
      console.log(
        `[Protocol indexer]: Loop has failed with message: ${
          (error as Error).message
        }.  It will retry...`,
      );
    }

    await sleep(INDEXING_BUFFER);
  }
};

main()
  .then(() => {
    console.log('[Protocol indexer]: Execution completed.');
  })
  .catch((error) => {
    console.log(
      `[Protocol indexer]: Error encountered. ${
        (error as unknown as Error).message
      }`,
    );
  });
