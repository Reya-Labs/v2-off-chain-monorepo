import { TableField } from '@google-cloud/bigquery';
import { PRECISION, SCALE } from '../constants';
import { rawEventsBaseTableSchema } from '../common-table-support/rawEventsBaseTableSchema';

export const rawCollateralConfiguredTableSchema: TableField[] = [
  ...rawEventsBaseTableSchema,

  { name: 'depositingEnabled', type: 'BOOLEAN', mode: 'REQUIRED' },

  {
    name: 'liquidationBooster',
    type: 'BIGNUMERIC',
    mode: 'REQUIRED',
    precision: PRECISION.toString(),
    scale: SCALE.toString(),
  },

  { name: 'tokenAddress', type: 'STRING', mode: 'REQUIRED' },
  { name: 'cap', type: 'STRING', mode: 'REQUIRED' },
];
