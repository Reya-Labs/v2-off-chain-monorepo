import { V2Pool } from '../../types';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { mockedPools } from './mock';

export type GetV2PoolsArgs = {
  chainIds: number[];
};

export async function getV2Pools({
  chainIds,
}: GetV2PoolsArgs): Promise<V2Pool[]> {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  return mockedPools;
}
