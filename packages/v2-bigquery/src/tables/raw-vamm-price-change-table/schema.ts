import { TableField } from '@google-cloud/bigquery';
import { rawEventsBaseTableSchema } from '../../utils/raw-events-support/rawEventsBaseTableSchema';

export const rawVammPriceChangeTableSchema: TableField[] = [
  ...rawEventsBaseTableSchema,

  { name: 'marketId', type: 'STRING', mode: 'REQUIRED' },
  { name: 'maturityTimestamp', type: 'INTEGER', mode: 'REQUIRED' },
  { name: 'tick', type: 'INTEGER', mode: 'REQUIRED' },
];
