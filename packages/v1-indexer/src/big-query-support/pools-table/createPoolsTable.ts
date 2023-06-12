import { Table } from '@google-cloud/bigquery';

import { getBigQuery } from '../../global';
import { getTable } from '../get-table';
import { DATASET_ID, getTableName, PRECISION, SCALE } from '../utils';

export const createPoolsTable = async (): Promise<void> => {
  const bigQuery = getBigQuery();
  const tableName = getTableName('pools');

  const existingTable: Table | null = await getTable(tableName);

  if (existingTable) {
    console.log(`${tableName} already exists`);
    return;
  }

  const schema = [
    { name: 'chainId', type: 'INTEGER', mode: 'REQUIRED' },
    { name: 'factory', type: 'STRING', mode: 'REQUIRED' },

    { name: 'deploymentBlockNumber', type: 'INTEGER', mode: 'REQUIRED' },
    { name: 'deploymentTimestampInMS', type: 'INTEGER', mode: 'REQUIRED' },
    { name: 'rowLastUpdatedTimestampInMS', type: 'INTEGER', mode: 'REQUIRED' },

    { name: 'vamm', type: 'STRING', mode: 'REQUIRED' },
    { name: 'marginEngine', type: 'STRING', mode: 'REQUIRED' },
    { name: 'rateOracle', type: 'STRING', mode: 'REQUIRED' },
    { name: 'protocolId', type: 'INTEGER', mode: 'REQUIRED' },

    { name: 'tickSpacing', type: 'INTEGER', mode: 'REQUIRED' },

    { name: 'termStartTimestampInMS', type: 'INTEGER', mode: 'REQUIRED' },
    { name: 'termEndTimestampInMS', type: 'INTEGER', mode: 'REQUIRED' },

    { name: 'tokenId', type: 'STRING', mode: 'REQUIRED' },
    { name: 'tokenName', type: 'STRING', mode: 'REQUIRED' },
    { name: 'tokenDecimals', type: 'INTEGER', mode: 'REQUIRED' },

    { name: 'hidden', type: 'BOOLEAN', mode: 'REQUIRED' },
    { name: 'traderHidden', type: 'BOOLEAN', mode: 'REQUIRED' },
    { name: 'traderWithdrawable', type: 'BOOLEAN', mode: 'REQUIRED' },

    {
      name: 'minLeverageAllowed',
      type: 'BIGNUMERIC',
      mode: 'REQUIRED',
      precision: PRECISION.toString(),
      scale: SCALE.toString(),
    },

    { name: 'rollover', type: 'STRING', mode: 'REQUIRED' },
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
