import { createProtocolV2Dataset } from '@voltz-protocol/bigquery-v2';
import { CHAIN_IDS, INDEXING_BUFFER } from './constants';
import { sync } from './sync';
import { sleep } from '@voltz-protocol/commons-v2';
import { getAndPushAllLiquidityIndices } from '../liquidity-indices/getAndPushAllLiquidityIndices';

export const main = async () => {
  await createProtocolV2Dataset();

  while (true) {
    const start = Date.now().valueOf();

    await getAndPushAllLiquidityIndices();
    await sync(CHAIN_IDS);

    // Aim for some minimum buffer between runs such that RPC endpoint is not over-used
    const timeInLoop = Date.now().valueOf() - start;
    if (timeInLoop < INDEXING_BUFFER) {
      await sleep(INDEXING_BUFFER - timeInLoop);
    }
  }
};

main()
  .then(() => {
    console.log('[Protocol indexer]: Execution completed.');
  })
  .catch((error) => {
    console.log(
      `[Protocol indexer]: Error encountered. ${(error as Error).message}`,
    );
  });
