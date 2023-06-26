import { insertLiquidityIndex } from '@voltz-protocol/bigquery-v2';
import {
  Address,
  descale,
  getRateOracleContract,
} from '@voltz-protocol/commons-v2';
import { getProvider } from '../services/getProvider';

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

  await insertLiquidityIndex({
    chainId,
    blockNumber,
    blockTimestamp,
    oracleAddress,
    liquidityIndex,
  });
};
