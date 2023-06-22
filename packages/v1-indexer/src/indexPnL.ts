import { createPositionsTable } from './big-query-support/positions-table/createPositionsTable';
import { syncPnL } from './pnl/syncPnL';
import { createProtocolV1Dataset } from './big-query-support/utils';

const chainIds = [42161];

export const main = async () => {
  await createProtocolV1Dataset();
  await createPositionsTable();

  const targetTimestamp = 1687294800;

  await syncPnL(chainIds, targetTimestamp);
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
