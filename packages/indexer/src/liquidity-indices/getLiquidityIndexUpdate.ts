import {
  LiquidityIndexEntry,
  UpdateBatch,
  insertLiquidityIndex,
} from '@voltz-protocol/bigquery-v2';
import {
  Address,
  descale,
  exponentialBackoff,
  getRateOracleContract,
} from '@voltz-protocol/commons-v2';
import { getProvider } from '../services/getProvider';
import { getEnvironmentV2 } from '../services/envVars';

export const getLiquidityIndexUpdate = async (
  chainId: number,
  oracleAddress: Address,
  blockNumber: number,
  blockTimestamp: number,
): Promise<UpdateBatch> => {
  const provider = getProvider(chainId);
  const oracleContract = getRateOracleContract(provider, oracleAddress);

  const liquidityIndexE18 = await exponentialBackoff(() =>
    oracleContract.getCurrentIndex({
      blockTag: blockNumber,
    }),
  );

  const liquidityIndex = descale(18)(liquidityIndexE18);

  const entry: LiquidityIndexEntry = {
    chainId,
    blockNumber,
    blockTimestamp,
    oracleAddress,
    liquidityIndex,
  };

  const updateBatch = insertLiquidityIndex(getEnvironmentV2(), entry);
  return updateBatch;
};
