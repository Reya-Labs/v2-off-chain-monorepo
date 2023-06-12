import { Table } from '@google-cloud/bigquery';

import { getBigQuery } from '../../global';
import { getTable } from '../get-table';
import {
  getProtocolV1DatasetName,
  getTableName,
  PRECISION,
  SCALE,
  TableType,
} from '../utils';

export const createPositionsTable = async (): Promise<void> => {
  const bigQuery = getBigQuery();
  const tableName = getTableName(TableType.positions);

  const existingTable: Table | null = await getTable(tableName);

  if (existingTable) {
    console.log(`${tableName} already exists`);
    return;
  }

  const schema = [
    { name: 'marginEngineAddress', type: 'STRING', mode: 'REQUIRED' },
    { name: 'vammAddress', type: 'STRING', mode: 'REQUIRED' },
    { name: 'ownerAddress', type: 'STRING', mode: 'REQUIRED' },
    { name: 'tickLower', type: 'INTEGER', mode: 'REQUIRED' },
    { name: 'tickUpper', type: 'INTEGER', mode: 'REQUIRED' },
    {
      name: 'realizedPnLFromSwaps',
      type: 'BIGNUMERIC',
      mode: 'REQUIRED',
      precision: PRECISION.toString(),
      scale: SCALE.toString(),
    },
    {
      name: 'realizedPnLFromFeesPaid',
      type: 'BIGNUMERIC',
      mode: 'REQUIRED',
      precision: PRECISION.toString(),
      scale: SCALE.toString(),
    },
    {
      name: 'netNotionalLocked',
      type: 'BIGNUMERIC',
      mode: 'REQUIRED',
      precision: PRECISION.toString(),
      scale: SCALE.toString(),
    },
    {
      name: 'netFixedRateLocked',
      type: 'BIGNUMERIC',
      mode: 'REQUIRED',
      precision: PRECISION.toString(),
      scale: SCALE.toString(),
    },
    { name: 'lastUpdatedBlockNumber', type: 'INTEGER', mode: 'REQUIRED' },
    {
      name: 'notionalLiquidityProvided',
      type: 'BIGNUMERIC',
      mode: 'REQUIRED',
      precision: PRECISION.toString(),
      scale: SCALE.toString(),
    },
    {
      name: 'realizedPnLFromFeesCollected',
      type: 'BIGNUMERIC',
      mode: 'REQUIRED',
      precision: PRECISION.toString(),
      scale: SCALE.toString(),
    },
    {
      name: 'netMarginDeposited',
      type: 'BIGNUMERIC',
      mode: 'REQUIRED',
      precision: PRECISION.toString(),
      scale: SCALE.toString(),
    },
    {
      name: 'rateOracleIndex',
      type: 'BIGNUMERIC',
      mode: 'REQUIRED',
      precision: PRECISION.toString(),
      scale: SCALE.toString(),
    },
    { name: 'rowLastUpdatedTimestamp', type: 'TIMESTAMP', mode: 'REQUIRED' },
    {
      name: 'fixedTokenBalance',
      type: 'BIGNUMERIC',
      mode: 'REQUIRED',
      precision: PRECISION.toString(),
      scale: SCALE.toString(),
    },
    {
      name: 'variableTokenBalance',
      type: 'BIGNUMERIC',
      mode: 'REQUIRED',
      precision: PRECISION.toString(),
      scale: SCALE.toString(),
    },
    {
      name: 'positionInitializationBlockNumber',
      type: 'INTEGER',
      mode: 'REQUIRED',
    },
    { name: 'rateOracle', type: 'STRING', mode: 'REQUIRED' },
    { name: 'underlyingToken', type: 'STRING', mode: 'REQUIRED' },
    { name: 'chainId', type: 'INTEGER', mode: 'REQUIRED' },
    {
      name: 'cashflowLiFactor',
      type: 'BIGNUMERIC',
      mode: 'REQUIRED',
      precision: PRECISION.toString(),
      scale: SCALE.toString(),
    },
    {
      name: 'cashflowTimeFactor',
      type: 'BIGNUMERIC',
      mode: 'REQUIRED',
      precision: PRECISION.toString(),
      scale: SCALE.toString(),
    },
    {
      name: 'cashflowFreeTerm',
      type: 'BIGNUMERIC',
      mode: 'REQUIRED',
      precision: PRECISION.toString(),
      scale: SCALE.toString(),
    },
    {
      name: 'liquidity',
      type: 'BIGNUMERIC',
      mode: 'REQUIRED',
      precision: PRECISION.toString(),
      scale: SCALE.toString(),
    },
  ];

  // For all options, see https://cloud.google.com/bigquery/docs/reference/v2/tables#resource
  const options = {
    schema: schema,
    location: 'europe-west2',
  };

  // Create a new table in the dataset
  const [table] = await bigQuery
    .dataset(getProtocolV1DatasetName())
    .createTable(tableName, options);

  console.log(`Table ${table.id || ''} created.`);
};
