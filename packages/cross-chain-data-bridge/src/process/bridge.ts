import { CHAIN_IDS, DATA_BRIDGING_BUFFER } from './constants';
import { bridgeOracleRates } from './bridgeOracleRates';
import { sleep } from '@voltz-protocol/commons-v2';
import { createLoggingDirectory } from '../logging/createLoggingDirectory';
import { log } from '../logging/log';

export const main = async () => {
  createLoggingDirectory();

  log('');
  log('Process is executed again...');
  log('');

  while (true) {
    const start = Date.now().valueOf();

    await bridgeOracleRates(CHAIN_IDS);

    // Aim for some minimum buffer between runs such that RPC endpoint is not over-used
    const timeInLoop = Date.now().valueOf() - start;
    if (timeInLoop < DATA_BRIDGING_BUFFER) {
      await sleep(DATA_BRIDGING_BUFFER - timeInLoop);
    }

    log('');
  }
};

main()
  .then(() => {
    log('[Protocol cross-chain data bridge]: Execution completed.');
  })
  .catch((error) => {
    log(
      `[Protocol cross-chain data bridge]: Error encountered. ${
        (error as Error).message
      }`,
    );
  });
