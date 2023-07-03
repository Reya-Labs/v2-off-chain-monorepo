import { V1V2Pool, V2Pool } from '@voltz-protocol/api-v2-types';

export const extendV2Pool = (p: V2Pool): V1V2Pool => ({
  ...p,

  vamm: '',
  marginEngineAddress: '',
  flags: {
    isGLP28Jun2023: false,
  },
});
