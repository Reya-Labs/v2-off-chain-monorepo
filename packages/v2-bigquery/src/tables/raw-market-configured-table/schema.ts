import { TableField } from '@google-cloud/bigquery';
import { rawEventsBaseTableSchema } from '../../utils/raw-events-support/rawEventsBaseTableSchema';

export const rawMarketConfiguredTableSchema: TableField[] = [
  ...rawEventsBaseTableSchema,

  { name: 'marketId', type: 'STRING', mode: 'REQUIRED' },
  { name: 'quoteToken', type: 'STRING', mode: 'REQUIRED' },
];
