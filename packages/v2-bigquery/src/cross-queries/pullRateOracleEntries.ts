import { Address } from '@voltz-protocol/commons-v2';
import { getBigQuery } from '../client';
import { TableType } from '../types';
import { getTableFullName } from '../utils/getTableName';

type RateOracleEntry = {
  chainId: number;
  oracleAddress: Address;
};

const mapToRateOracleEntry = (row: any): RateOracleEntry => row;

export const pullRateOracleEntries = async (
  environmentV2Tag: string,
): Promise<RateOracleEntry[]> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_rate_oracle_configured,
  );

  const sqlQuery = `SELECT DISTINCT chainId, oracleAddress FROM \`${tableName}\``;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map(mapToRateOracleEntry);
};
