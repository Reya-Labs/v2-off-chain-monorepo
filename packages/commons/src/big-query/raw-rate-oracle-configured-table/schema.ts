import { TableField } from '@google-cloud/bigquery';
import { rawEventsBaseTableSchema } from '../common-table-support/rawEventsBaseTableSchema';

export const rawRateOracleConfiguredTableSchema: TableField[] = [
  ...rawEventsBaseTableSchema,

  { name: 'marketId', type: 'STRING', mode: 'REQUIRED' },
  { name: 'oracleAddress', type: 'STRING', mode: 'REQUIRED' },
];
