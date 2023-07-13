import * as fs from 'fs';
import { getLoggingDirectory } from './getLoggingDirectory';

export const log = (message: string, specificFileNames: string[] = []) => {
  const date = new Date().toISOString();
  const text = message.length === 0 ? '' : `${date}: ${message}`;

  console.log(text);

  for (const fileName of ['logs'].concat(specificFileNames)) {
    const file = `${getLoggingDirectory()}/${fileName}.txt`;
    fs.appendFileSync(file, `${text}\n`);
  }
};
