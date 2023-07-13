import { TableField } from '@google-cloud/bigquery';
import { PRECISION, SCALE } from '../../constants';
import { rawEventsBaseTableSchema } from '../../utils/rawEventsBaseTableSchema';

export const rawMarketFeeConfiguredTableSchema: TableField[] = [
  ...rawEventsBaseTableSchema,

  { name: 'productId', type: 'STRING', mode: 'REQUIRED' },
  { name: 'marketId', type: 'STRING', mode: 'REQUIRED' },
  { name: 'feeCollectorAccountId', type: 'STRING', mode: 'REQUIRED' },

  {
    name: 'atomicMakerFee',
    type: 'BIGNUMERIC',
    mode: 'REQUIRED',
    precision: PRECISION.toString(),
    scale: SCALE.toString(),
  },

  {
    name: 'atomicTakerFee',
    type: 'BIGNUMERIC',
    mode: 'REQUIRED',
    precision: PRECISION.toString(),
    scale: SCALE.toString(),
  },
];
