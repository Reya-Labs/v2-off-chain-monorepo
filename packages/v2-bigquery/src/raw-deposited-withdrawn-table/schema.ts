import { TableField } from '@google-cloud/bigquery';
import { rawEventsBaseTableSchema } from '../common-table-support/rawEventsBaseTableSchema';
import { PRECISION, SCALE } from '../constants';

export const rawDepositedWithdrawnTableSchema: TableField[] = [
  ...rawEventsBaseTableSchema,

  { name: 'accountId', type: 'STRING', mode: 'REQUIRED' },
  { name: 'collateralType', type: 'STRING', mode: 'REQUIRED' },

  {
    name: 'tokenAmount',
    type: 'BIGNUMERIC',
    mode: 'REQUIRED',
    precision: PRECISION.toString(),
    scale: SCALE.toString(),
  },
];
