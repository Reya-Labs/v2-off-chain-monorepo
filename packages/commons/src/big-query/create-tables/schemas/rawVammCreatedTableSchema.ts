import { TableField } from '@google-cloud/bigquery';
import { PRECISION, SCALE } from '../../constants';
import { rawEventsBaseTableSchema } from './rawEventsBaseTableSchema';

export const rawVammCreatedTableSchema: TableField[] = [
  ...rawEventsBaseTableSchema,

  { name: 'marketId', type: 'STRING', mode: 'REQUIRED' },
  { name: 'tick', type: 'INTEGER', mode: 'REQUIRED' },

  {
    name: 'priceImpactPhi',
    type: 'BIGNUMERIC',
    mode: 'REQUIRED',
    precision: PRECISION.toString(),
    scale: SCALE.toString(),
  },

  {
    name: 'priceImpactBeta',
    type: 'BIGNUMERIC',
    mode: 'REQUIRED',
    precision: PRECISION.toString(),
    scale: SCALE.toString(),
  },

  {
    name: 'spread',
    type: 'BIGNUMERIC',
    mode: 'REQUIRED',
    precision: PRECISION.toString(),
    scale: SCALE.toString(),
  },

  { name: 'rateOracle', type: 'STRING', mode: 'REQUIRED' },
  { name: 'maxLiquidityPerTick', type: 'STRING', mode: 'REQUIRED' },
  { name: 'tickSpacing', type: 'INTEGER', mode: 'REQUIRED' },
  { name: 'maturityTimestamp', type: 'INTEGER', mode: 'REQUIRED' },
];
