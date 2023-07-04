import {
  SupportedChainId,
  fetchMultiplePromises,
} from '@voltz-protocol/commons-v2';
import { AvailableNotional } from '@voltz-protocol/api-v2-types';
import { getCurrentTick, getNotionalInRange } from '@voltz-protocol/indexer-v1';

export const getV1AvailableNotional = async (
  chainId: SupportedChainId,
  vammAddress: string,
): Promise<AvailableNotional> => {
  const currentTick = await getCurrentTick(chainId, vammAddress);

  const [long, short] = await fetchMultiplePromises(
    [
      getNotionalInRange(chainId, vammAddress, -100000, currentTick),
      getNotionalInRange(chainId, vammAddress, currentTick, 100000),
    ],
    true,
  );

  return {
    short,
    long,
  };
};
