import { TableField } from '@google-cloud/bigquery';
import { PRECISION, SCALE } from '../../constants';
import { rawEventsBaseTableSchema } from '../../utils/raw-events-support/rawEventsBaseTableSchema';

export const rawLiquidityChangeTableSchema: TableField[] = [
  ...rawEventsBaseTableSchema,

  { name: 'accountId', type: 'STRING', mode: 'REQUIRED' },
  { name: 'marketId', type: 'STRING', mode: 'REQUIRED' },
  { name: 'maturityTimestamp', type: 'INTEGER', mode: 'REQUIRED' },
  { name: 'quoteToken', type: 'STRING', mode: 'REQUIRED' },

  { name: 'tickLower', type: 'INTEGER', mode: 'REQUIRED' },
  { name: 'tickUpper', type: 'INTEGER', mode: 'REQUIRED' },

  {
    name: 'liquidityDelta',
    type: 'BIGNUMERIC',
    mode: 'REQUIRED',
    precision: PRECISION.toString(),
    scale: SCALE.toString(),
  },
];
