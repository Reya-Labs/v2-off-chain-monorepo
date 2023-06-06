import { TableField } from '@google-cloud/bigquery';
import { PRECISION, SCALE } from '../../constants';

export const rawVammCreatedTableSchema: TableField[] = [
  { name: 'id', type: 'STRING', mode: 'REQUIRED' },
  { name: 'type', type: 'STRING', mode: 'REQUIRED' },
  { name: 'chainId', type: 'INTEGER', mode: 'REQUIRED' },
  { name: 'source', type: 'STRING', mode: 'REQUIRED' },

  { name: 'blockTimestamp', type: 'INTEGER', mode: 'REQUIRED' },
  { name: 'blockNumber', type: 'INTEGER', mode: 'REQUIRED' },
  { name: 'blockHash', type: 'STRING', mode: 'REQUIRED' },

  { name: 'transactionIndex', type: 'INTEGER', mode: 'REQUIRED' },
  { name: 'transactionHash', type: 'STRING', mode: 'REQUIRED' },
  { name: 'logIndex', type: 'INTEGER', mode: 'REQUIRED' },

  { name: 'marketId', type: 'STRING', mode: 'REQUIRED' },

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
