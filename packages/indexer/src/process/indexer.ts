import { createProtocolV2Dataset } from '@voltz-protocol/bigquery-v2';
import { CHAIN_IDS, INDEXING_BUFFER } from './constants';
import { sync } from './sync';
import { sleep } from '@voltz-protocol/commons-v2';
import { getAndPushAllLiquidityIndices } from '../liquidity-indices/getAndPushAllLiquidityIndices';

export const main = async () => {
  await createProtocolV2Dataset();

  while (true) {
    try {
      await getAndPushAllLiquidityIndices();
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
