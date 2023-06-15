import { V2Pool } from '../../v2-queries/get-pools/types';
import { V1V2Pool } from './types';

export const extendV2Pool = (p: V2Pool): V1V2Pool => ({
  ...p,

  vamm: '',
  marginEngineAddress: '',
});
