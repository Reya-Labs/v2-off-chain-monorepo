import { createProtocolV2Dataset } from '@voltz-protocol/bigquery-v2';
import { CHAIN_IDS, INDEXING_BUFFER } from './constants';
import { sync } from './sync';
import { sleep } from '@voltz-protocol/commons-v2';
import { updateAllRateOracles } from '../liquidity-indices/updateAllRateOracles';
import { createLoggingPlace } from '../logging/createLoggingPlace';
import { log } from '../logging/log';
import { getEnvironmentV2 } from '../services/envVars';

export const main = async () => {
  await createProtocolV2Dataset(getEnvironmentV2());
  createLoggingPlace();

  log('');
  log('Process is executed again...');
  log('');

  while (true) {
    const start = Date.now().valueOf();

    await updateAllRateOracles();
    await sync(CHAIN_IDS);

    // Aim for some minimum buffer between runs such that RPC endpoint is not over-used
    const timeInLoop = Date.now().valueOf() - start;
    if (timeInLoop < INDEXING_BUFFER) {
      await sleep(INDEXING_BUFFER - timeInLoop);
    }

    log('');
  }
};

main()
  .then(() => {
    log('[Protocol indexer]: Execution completed.');
  })
  .catch((error) => {
    log(`[Protocol indexer]: Error encountered. ${(error as Error).message}`);
  });
