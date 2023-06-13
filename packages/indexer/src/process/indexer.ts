import {
  createProtocolV2Dataset,
  createTable,
  TableType,
} from '@voltz-protocol/bigquery-v2';
import { CHAIN_IDS, INDEXING_BUFFER } from './constants';
import { fetchLiquidityIndices } from './fetchLiquidityIndex';
import { sync } from './sync';
import { sleep } from '@voltz-protocol/commons-v2';

export const main = async () => {
  await createProtocolV2Dataset();
  await createTable(TableType.raw_collateral_updates);
  await createTable(TableType.liquidity_indices);

  while (true) {
    try {
      await fetchLiquidityIndices();
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
