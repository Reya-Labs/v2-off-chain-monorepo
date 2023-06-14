import { insertLiquidityIndex } from '@voltz-protocol/bigquery-v2';
import {
  Address,
  descale,
  getRateOracleContract,
} from '@voltz-protocol/commons-v2';

export const getAndPushLiquidityIndex = async (
  chainId: number,
  oracleAddress: Address,
  blockNumber: number,
  blockTimestamp: number,
): Promise<void> => {
  const oracleContract = getRateOracleContract(chainId, oracleAddress);

  const liquidityIndexE27 = await oracleContract.getCurrentRateInRay({
    blockTag: blockNumber,
  });

  const liquidityIndex = descale(27)(liquidityIndexE27);

  await insertLiquidityIndex({
    chainId,
    blockNumber,
    blockTimestamp,
    oracleAddress,
    liquidityIndex,
  });
};
