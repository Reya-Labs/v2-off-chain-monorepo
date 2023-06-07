import { TableField } from '@google-cloud/bigquery';
import { rawEventsBaseTableSchema } from './rawEventsBaseTableSchema';

export const rawRateOracleConfiguredTableSchema: TableField[] = [
  ...rawEventsBaseTableSchema,

  { name: 'marketId', type: 'STRING', mode: 'REQUIRED' },
  { name: 'oracleAddress', type: 'STRING', mode: 'REQUIRED' },
];
