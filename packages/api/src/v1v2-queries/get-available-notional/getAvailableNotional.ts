import { AvailableNotional } from '@voltz-protocol/api-sdk-v2';
import { decodeV1PoolId, decodeV2PoolId } from '@voltz-protocol/commons-v2';
import { getV1AvailableNotional } from '../../v1-queries/get-pools/getAvailableNotional';
import { getV2AvailableNotional } from '../../v2-queries/get-pools/getAvailableNotional';
import { log } from '../../logging/log';

export const getV1V2AvailableNotional = async (
  poolId: string,
): Promise<AvailableNotional> => {
  if (poolId.endsWith('v1')) {
    try {
      const { chainId, vammAddress } = decodeV1PoolId(poolId);
      const result = await getV1AvailableNotional(chainId, vammAddress);
      return result;
    } catch (error) {
      log(`Unable to fetch available notional for V1 pool ${poolId}`);
      return {
        short: 0,
        long: 0,
      };
    }
  }

  if (poolId.endsWith('v2')) {
    try {
      const { chainId, marketId, maturityTimestamp } = decodeV2PoolId(poolId);
      const result = await getV2AvailableNotional(
        chainId,
        marketId,
        maturityTimestamp,
      );
      return result;
    } catch (error) {
      log(`Unable to fetch available notional for V2 pool ${poolId}`);
      return {
        short: 0,
        long: 0,
      };
    }
  }

  log(`Could not find V1V2 pool with id ${poolId}`);
  return {
    short: 0,
    long: 0,
  };
};
