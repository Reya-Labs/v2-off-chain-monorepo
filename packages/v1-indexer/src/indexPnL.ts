import { createPositionsTable } from './big-query-support/positions-table/createPositionsTable';
import { syncPnL } from './pnl/syncPnL';
import { indexInactiveTimeInMS } from './global';
import { sleep } from '@voltz-protocol/commons-v2';
import { createProtocolV1Dataset } from './big-query-support/utils';

const chainIds = [1, 42161, 43114];

export const main = async () => {
  await createProtocolV1Dataset();
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

    if (Date.now() > 1694606400 * 1000) {
      await sleep(indexInactiveTimeInMS);
    }
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
