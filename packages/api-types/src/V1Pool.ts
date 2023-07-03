import { BasePool } from './BasePool';

export type V1Pool = BasePool & {
  vamm: string;
  marginEngineAddress: string;
  flags: {
    isGLP28Jun2023: boolean;
  };
};
