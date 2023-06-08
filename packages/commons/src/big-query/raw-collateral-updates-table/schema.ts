import { TableField } from '@google-cloud/bigquery';
import { PRECISION, SCALE } from '../constants';
import { rawEventsBaseTableSchema } from '../common-table-support/rawEventsBaseTableSchema';

export const rawCollateralUpdateTableSchema: TableField[] = [
  ...rawEventsBaseTableSchema,

  { name: 'accountId', type: 'STRING', mode: 'REQUIRED' },
  { name: 'collateralType', type: 'STRING', mode: 'REQUIRED' },

  {
    name: 'collateralAmount',
    type: 'BIGNUMERIC',
    mode: 'REQUIRED',
    precision: PRECISION.toString(),
    scale: SCALE.toString(),
  },

  {
    name: 'liquidatorBoosterAmount',
    type: 'BIGNUMERIC',
    mode: 'REQUIRED',
    precision: PRECISION.toString(),
    scale: SCALE.toString(),
  },
];
