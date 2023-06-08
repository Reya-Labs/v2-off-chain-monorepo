import { TableField } from '@google-cloud/bigquery';

export const accountsTableSchema: TableField[] = [
  { name: 'chainId', type: 'INTEGER', mode: 'REQUIRED' },
  { name: 'accountId', type: 'STRING', mode: 'REQUIRED' },
  { name: 'owner', type: 'STRING', mode: 'REQUIRED' },
];
