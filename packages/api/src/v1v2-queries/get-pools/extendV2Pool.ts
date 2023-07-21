import { V1V2Pool, V2Pool } from '@voltz-protocol/api-sdk-v2';

export const extendV2Pool = (p: V2Pool): V1V2Pool => ({
  ...p,

  vamm: '',
  marginEngineAddress: '',
});
