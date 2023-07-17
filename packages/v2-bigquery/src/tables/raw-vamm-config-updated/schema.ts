import { TableField } from '@google-cloud/bigquery';
import { PRECISION, SCALE } from '../../constants';
import { rawEventsBaseTableSchema } from '../../utils/raw-events-support/rawEventsBaseTableSchema';

export const rawVammConfigUpdatedTableSchema: TableField[] = [
  ...rawEventsBaseTableSchema,

  { name: 'marketId', type: 'STRING', mode: 'REQUIRED' },
  { name: 'maturityTimestamp', type: 'INTEGER', mode: 'REQUIRED' },

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

  { name: 'minTick', type: 'INTEGER', mode: 'REQUIRED' },
  { name: 'maxTick', type: 'INTEGER', mode: 'REQUIRED' },
];
