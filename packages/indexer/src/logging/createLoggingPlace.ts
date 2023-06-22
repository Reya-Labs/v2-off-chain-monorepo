import * as fs from 'fs';

export const createLoggingPlace = () => {
  const dir = './logs';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};
