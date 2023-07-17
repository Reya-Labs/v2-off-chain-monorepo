import { TableField } from '@google-cloud/bigquery';
import { PRECISION, SCALE } from '../../constants';

export const irsVammPoolTableSchema: TableField[] = [
  { name: 'id', type: 'STRING', mode: 'REQUIRED' },

  { name: 'chainId', type: 'INTEGER', mode: 'REQUIRED' },
  { name: 'marketId', type: 'STRING', mode: 'REQUIRED' },
  { name: 'maturityTimestamp', type: 'INTEGER', mode: 'REQUIRED' },

  { name: 'rateOracle', type: 'STRING', mode: 'REQUIRED' },

  {
    name: 'spread',
    type: 'BIGNUMERIC',
    mode: 'REQUIRED',
    precision: PRECISION.toString(),
    scale: SCALE.toString(),
  },

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

  { name: 'tickSpacing', type: 'INTEGER', mode: 'REQUIRED' },
  { name: 'minTick', type: 'INTEGER', mode: 'REQUIRED' },
  { name: 'maxTick', type: 'INTEGER', mode: 'REQUIRED' },
  { name: 'currentTick', type: 'INTEGER', mode: 'REQUIRED' },

  { name: 'creationTimestamp', type: 'INTEGER', mode: 'REQUIRED' },
];
