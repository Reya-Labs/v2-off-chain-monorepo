import { TableField } from '@google-cloud/bigquery';
import { rawEventsBaseTableSchema } from '../common-table-support/rawEventsBaseTableSchema';

export const rawProductRegisteredTableSchema: TableField[] = [
  ...rawEventsBaseTableSchema,

  { name: 'product', type: 'STRING', mode: 'REQUIRED' },
  { name: 'productId', type: 'STRING', mode: 'REQUIRED' },
  { name: 'name', type: 'STRING', mode: 'REQUIRED' },
  { name: 'sender', type: 'STRING', mode: 'REQUIRED' },
];
