import * as dotenv from 'dotenv';

dotenv.config();

import { app } from './app';

const main = async () => {
  const PORT = process.env.PORT || 8080;
  console.log('PORT:', PORT);
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

main()
  .then(() => {
    console.log('Execution completed.');
  })
  .catch((error) => {
    console.log(`Error encountered. ${(error as unknown as Error).message}`);
  });
