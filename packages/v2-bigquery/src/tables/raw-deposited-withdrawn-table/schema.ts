import { TableField } from '@google-cloud/bigquery';
import { PRECISION, SCALE } from '../../constants';
import { rawEventsBaseTableSchema } from '../../utils/rawEventsBaseTableSchema';

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
