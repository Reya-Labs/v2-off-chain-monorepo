import { fetchMultiplePromises } from '@voltz-protocol/commons-v2';
import { AvailableNotional } from '@voltz-protocol/api-v2-types';
import { getCurrentTick, getNotionalInRange } from '@voltz-protocol/indexer-v1';

export const getV1AvailableNotional = async (
  chainId: number,
  vammAddress: string,
): Promise<AvailableNotional> => {
  const currentTick = await getCurrentTick(chainId, vammAddress);

  const { data, isError } = await fetchMultiplePromises([
    getNotionalInRange(chainId, vammAddress, -100000, currentTick),
    getNotionalInRange(chainId, vammAddress, currentTick, 100000),
  ]);

  if (isError) {
    return {
      short: 0,
      long: 0,
    };
  }

  const [long, short] = data;

  return {
    short,
    long,
  };
};
