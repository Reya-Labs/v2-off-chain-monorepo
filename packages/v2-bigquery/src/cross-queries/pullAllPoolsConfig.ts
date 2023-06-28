import { Address } from '@voltz-protocol/commons-v2';
import { getBigQuery } from '../client';
import { TableType } from '../types';
import { getTableFullName } from '../utils/getTableName';

export type PoolEntry = {
  chainId: number;
  marketId: string;
  maturityTimestamp: number;
  quoteToken: Address;
  rateOracle: Address;
  atomicMakerFee: number;
  atomicTakerFee: number;
  spread: number;
  priceImpactPhi: number;
  priceImpactBeta: number;
  tickSpacing: number;
  lastFixedRate: number;
};

const mapToPoolEntry = (row: any): PoolEntry => {
  return { ...row, lastFixedRate: 1.0001 ** -row.lastTick };
};

export const pullAllPoolsConfig = async (
  environmentV2Tag: string,
): Promise<PoolEntry[]> => {
  const bigQuery = getBigQuery();

  const marketsTableName = getTableFullName(
    environmentV2Tag,
    TableType.markets,
  );

  const vammTableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_vamm_created,
  );

  const vammPriceChangeTableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_vamm_price_change,
  );

  const sqlQuery = `
    WITH last_tick as (
        SELECT blockTimestamp, chainId, tick, t1.marketId, t1.maturityTimestamp
        FROM \`${vammPriceChangeTableName}\`  t1
        INNER JOIN (
          SELECT marketId, maturityTimestamp, MAX(blockTimestamp) as max_timestamp
          FROM \`${vammPriceChangeTableName}\`
          GROUP BY marketId, maturityTimestamp
        ) t2
        ON t2.marketId = t1.marketId AND t2.maturityTimestamp = t1.maturityTimestamp AND 
          t2.max_timestamp = t1.blockTimestamp
      )

      SELECT 
          v.chainId as chainId,
          v.marketId as marketId,
          v.maturityTimestamp as maturityTimestamp,
          m.quoteToken as quoteToken,
          v.rateOracle as rateOracle,
          m.atomicMakerFee as atomicMakerFee,
          m.atomicTakerFee as atomicTakerFee,
          v.spread as spread,
          v.priceImpactPhi as priceImpactPhi,
          v.priceImpactBeta as priceImpactBeta,
          v.tickSpacing as tickSpacing,
          t.tick as lastTick
      FROM \`${marketsTableName}\`  m
      LEFT JOIN \`${vammTableName}\` v
      ON m.marketId = v.marketId
      LEFT JOIN last_tick t
      ON v.marketId = t.marketId AND v.maturityTimestamp = t.maturityTimestamp
    `;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map(mapToPoolEntry);
};
