import { SECONDS_IN_YEAR } from '../../utils/constants';
import { Address } from '../../utils/convertLowercase';
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
    latestApy: number;
    lastFixedRate: number;
  };

const mapToPoolEntry = (row: any): PoolEntry => {
   return {...row, lastFixedRate: 1.0001**(-row.lastTick)};
  };

export const pullAllPoolsConfig = async (): Promise<PoolEntry[]> => {
  const bigQuery = getBigQuery();
  const marketsTableName = getTableFullName(TableType.markets);
  const vammTableName = getTableFullName(TableType.raw_vamm_created);
  const vammPriceChangeTableName = getTableFullName(TableType.raw_vamm_price_change);
  const liquidityIndexTableName = getTableFullName(TableType.liquidity_indices);
  console.log(vammTableName)

  const sqlQuery = `
    WITH liquidity_ranking AS 
      (
        SELECT 
          blockTimestamp,
          liquidityIndex,
          ROW_NUMBER() over (PARTITION BY chainId, oracleAddres ORDER BY blockTimestamp DESC) AS rowNo,
          chainId,
          oracleAddres
        FROM \`${liquidityIndexTableName}\`
      ),

      last_two_indices AS (
        SELECT a.liquidityIndex AS lI, a.blockTimestamp AS lT, b.blockTimestamp AS sT, b.liquidityIndex AS sI, a.chainId, a.oracleAddres
          FROM liquidity_ranking a
          INNER JOIN liquidity_ranking b
        ON a.chainId = b.chainId AND a.oracleAddres = b.oracleAddres AND a.rowNo = 1 AND b.rowNo = 2
      ),

      last_tick as (
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
          (lI / sI - 1) * ${SECONDS_IN_YEAR} / (lT - sT) * 100 as latestApy,
          t.tick as lastTick
      FROM \`${marketsTableName}\`  m
      LEFT JOIN \`${vammTableName}\` v
      ON m.marketId = v.marketId
      LEFT JOIN last_two_indices i
      ON v.rateOracle = i.oracleAddres AND v.chainId = i.chainId
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
