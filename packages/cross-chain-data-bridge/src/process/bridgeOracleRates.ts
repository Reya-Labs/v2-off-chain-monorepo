import { pullRateOracleEntries } from '@voltz-protocol/bigquery-v2';
import { getEnvironmentV2 } from '../services/envVars';
import { log } from '../logging/log';
import { handleOracle } from '../handle-oracle/handleOracle';

export const bridgeOracleRates = async (chainIds: number[]): Promise<void> => {
  const allOracles = await pullRateOracleEntries(getEnvironmentV2());
  const activeOracles = allOracles.filter(
    (oracleEntry) =>
      oracleEntry.blockNumber ===
      allOracles
        .filter((oracleEntry2) => oracleEntry2.chainId === oracleEntry.chainId)
        .reduce(
          (latestEntry, currentEntry) =>
            latestEntry.blockNumber < currentEntry.blockNumber
              ? currentEntry
              : latestEntry,
          oracleEntry,
        ).blockNumber,
  );

  for (const chainId of chainIds) {
    // Log
    log(
      `[Protocol cross-chain data bridge, ${chainId}]: Processing active rate oracles...`,
    );

    // Fetch all oracles for the current chain id
    const oracles = activeOracles.filter(
      (oracleEntry) => oracleEntry.chainId === chainId,
    );

    // Handle event one by one
    for (const oracle of oracles) {
      await handleOracle(oracle.chainId, oracle.oracleAddress);
    }

    // todo: delete after mock oracles are configured in smart contracts
    await handleOracle(421613, '0x250e9b7d8170e6a1800c866373ba5975de033dc3');
    await handleOracle(421613, '0x0509de91e84a6063a1d22f11978cdf358f3df122');
  }
};
