import { getRateOracleContract } from '../contract-generators/rate-oracle';
import { descale, getProvider } from '@voltz-protocol/commons-v2';
import { insertLiquidityIndex } from '@voltz-protocol/commons-v2';
import { pullRateOracleEntries } from '@voltz-protocol/commons-v2';

export const fetchLiquidityIndices = async (): Promise<void> => {
  const oracles = await pullRateOracleEntries();

  for (const { chainId, oracleAddress } of oracles) {
    const provider = getProvider(chainId);

    const oracleContract = getRateOracleContract(chainId, oracleAddress);

    try {
      const { number: blockNumber, timestamp: blockTimestamp } =
        await provider.getBlock('latest');

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
    } catch (error) {
      console.log(
        `Failed to fetch liquidity index of rate oracle ${oracleAddress} on chain id ${chainId} with error message: ${
          (error as Error).message
        }.`,
      );
    }
  }
};
