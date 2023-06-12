import { TableField } from '@google-cloud/bigquery';
import { PRECISION, SCALE } from '../constants';

export const liquidityIndicesTableSchema: TableField[] = [
  { name: 'chainId', type: 'INTEGER', mode: 'REQUIRED' },
  { name: 'blockNumber', type: 'INTEGER', mode: 'REQUIRED' },
  { name: 'blockTimestamp', type: 'INTEGER', mode: 'REQUIRED' },
  { name: 'oracleAddress', type: 'STRING', mode: 'REQUIRED' },

  {
    name: 'liquidityIndex',
    type: 'BIGNUMERIC',
    mode: 'REQUIRED',
    precision: PRECISION.toString(),
    scale: SCALE.toString(),
  },
];
