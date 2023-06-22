import * as fs from 'fs';

export const log = (message: string, fileName: 'general' = 'general') => {
  const file = `./logs/${fileName}.txt`;

  const date = new Date().toISOString();
  const text = message.length === 0 ? '' : `${date}: ${message}`;

  console.log(text);
  fs.appendFileSync(file, `${text}\n`);
};
