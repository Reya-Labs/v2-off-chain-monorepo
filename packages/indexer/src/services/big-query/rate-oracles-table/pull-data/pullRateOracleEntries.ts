import { Address } from '../../../../utils/types';
import { getBigQuery } from '../../client';
import { getTableFullName } from '../../utils/getTableName';

type RateOracleEntry = {
  chainId: number;
  oracleAddress: Address;
};

const mapToRateOracleEntry = (row: any): RateOracleEntry => row;

export const pullRateOracleEntries = async (): Promise<RateOracleEntry[]> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName('rate_oracles');

  const sqlQuery = `SELECT * FROM \`${tableName}\``;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map(mapToRateOracleEntry);
};
