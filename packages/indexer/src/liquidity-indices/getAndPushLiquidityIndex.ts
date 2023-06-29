import {
  LiquidityIndexEntry,
  insertLiquidityIndex,
  sendUpdateBatches,
} from '@voltz-protocol/bigquery-v2';
import {
  Address,
  descale,
  getRateOracleContract,
} from '@voltz-protocol/commons-v2';
import { getProvider } from '../services/getProvider';
import { getEnvironmentV2 } from '../services/envVars';

export const getAndPushLiquidityIndex = async (
  chainId: number,
  oracleAddress: Address,
  blockNumber: number,
  blockTimestamp: number,
): Promise<void> => {
  const provider = getProvider(chainId);
  const oracleContract = getRateOracleContract(provider, oracleAddress);

  const liquidityIndexE18 = await oracleContract.getCurrentIndex({
    blockTag: blockNumber,
  });

  const liquidityIndex = descale(18)(liquidityIndexE18);

  const entry: LiquidityIndexEntry = {
    chainId,
    blockNumber,
    blockTimestamp,
    oracleAddress,
    liquidityIndex,
  };

  const updateBatch = insertLiquidityIndex(getEnvironmentV2(), entry);
  await sendUpdateBatches([updateBatch]);
};
