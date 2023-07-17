import { app } from './app';
import { createLoggingDirectory } from './logging/createLoggingDirectory';
import { log } from './logging/log';
import { getApiPort } from './services/envVars';

const main = async () => {
  createLoggingDirectory();
  const PORT = getApiPort();
  app.listen(PORT, () => {
    log(`Listening on port ${PORT}`);
  });
};

main()
  .then(() => {
    log('Execution completed.');
  })
  .catch((error) => {
    log(`Error encountered. ${(error as unknown as Error).message}`);
  });
