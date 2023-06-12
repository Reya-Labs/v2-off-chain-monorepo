import { Table } from '@google-cloud/bigquery';

import { getBigQuery } from '../../global';
import { getTable } from '../get-table';
import { DATASET_ID, getTableName, PRECISION, SCALE } from '../utils';

export const createActiveSwapsTable = async (): Promise<void> => {
  const bigQuery = getBigQuery();
  const tableName = getTableName('active_swaps');

  const existingTable: Table | null = await getTable(tableName);

  if (existingTable) {
    console.log(`${tableName} already exists`);
    return;
  }

  // todo: replace precision and scale in here with the constants PRECISION & SCALE
  const schema = [
    { name: 'eventId', type: 'STRING', mode: 'REQUIRED' },
    { name: 'vammAddress', type: 'STRING', mode: 'REQUIRED' },
    { name: 'ownerAddress', type: 'STRING', mode: 'REQUIRED' },
    { name: 'tickLower', type: 'INTEGER', mode: 'REQUIRED' },
    { name: 'tickUpper', type: 'INTEGER', mode: 'REQUIRED' },

    {
      name: 'variableTokenDelta',
      type: 'BIGNUMERIC',
      mode: 'REQUIRED',
      precision: PRECISION.toString(),
      scale: SCALE.toString(),
    },
    {
      name: 'fixedTokenDeltaUnbalanced',
      type: 'BIGNUMERIC',
      mode: 'REQUIRED',
      precision: PRECISION.toString(),
      scale: SCALE.toString(),
    },
    {
      name: 'feePaidToLps',
      type: 'BIGNUMERIC',
      mode: 'REQUIRED',
      precision: PRECISION.toString(),
      scale: SCALE.toString(),
    },

    { name: 'eventBlockNumber', type: 'INTEGER', mode: 'REQUIRED' },
    { name: 'eventTimestamp', type: 'TIMESTAMP', mode: 'REQUIRED' },
    { name: 'rowLastUpdatedTimestamp', type: 'TIMESTAMP', mode: 'REQUIRED' },

    { name: 'rateOracle', type: 'STRING', mode: 'REQUIRED' },
    { name: 'underlyingToken', type: 'STRING', mode: 'REQUIRED' },
    { name: 'marginEngineAddress', type: 'STRING', mode: 'REQUIRED' },
    { name: 'chainId', type: 'INTEGER', mode: 'REQUIRED' },
  ];

  // For all options, see https://cloud.google.com/bigquery/docs/reference/v2/tables#resource
  const options = {
    schema: schema,
    location: 'europe-west2',
  };

  // Create a new table in the dataset
  const [table] = await bigQuery
    .dataset(DATASET_ID)
    .createTable(tableName, options);

  console.log(`Table ${table.id || ''} created.`);
};
