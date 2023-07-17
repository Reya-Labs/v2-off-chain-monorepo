import * as fs from 'fs';
import { getLoggingDirectory } from './getLoggingDirectory';

export const createLoggingDirectory = () => {
  const dir = getLoggingDirectory();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};
