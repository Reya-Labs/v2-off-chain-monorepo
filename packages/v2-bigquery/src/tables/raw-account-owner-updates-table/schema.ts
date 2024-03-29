import { TableField } from '@google-cloud/bigquery';
import { rawEventsBaseTableSchema } from '../../utils/raw-events-support/rawEventsBaseTableSchema';

export const rawAccountOwnerUpdatesTableSchema: TableField[] = [
  ...rawEventsBaseTableSchema,
  { name: 'accountId', type: 'STRING', mode: 'REQUIRED' },
  { name: 'newOwner', type: 'STRING', mode: 'REQUIRED' },
];
