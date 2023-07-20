import { BasePool } from './BasePool';

export type V1Pool = BasePool & {
  vamm: string;
  marginEngineAddress: string;
};
