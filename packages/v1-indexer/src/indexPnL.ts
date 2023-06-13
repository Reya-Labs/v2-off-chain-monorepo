import { createPositionsTable } from './big-query-support/positions-table/createPositionsTable';
import { syncPnL } from './pnl/syncPnL';
import { indexInactiveTimeInMS } from './global';
import { sleep } from '@voltz-protocol/commons-v2';

const chainIds = [1, 42161, 43114];

export const main = async () => {
  await createPositionsTable();

  while (true) {
    try {
      await syncPnL(chainIds);
    } catch (error) {
      console.log(
        `[PnL]: Loop has failed with message: ${
          (error as Error).message
        }.  It will retry...`,
      );
    }

    await sleep(indexInactiveTimeInMS);
  }
};

main()
  .then(() => {
    console.log('[PnL]: Execution completed.');
  })
  .catch((error) => {
    console.log(
      `[PnL]: Error encountered. ${(error as unknown as Error).message}`,
    );
  });
