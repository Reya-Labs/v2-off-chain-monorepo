import { TableField } from '@google-cloud/bigquery';
import { PRECISION, SCALE } from '../../constants';

export const marketsTableSchema: TableField[] = [
  { name: 'chainId', type: 'INTEGER', mode: 'REQUIRED' },
  { name: 'marketId', type: 'STRING', mode: 'REQUIRED' },

  { name: 'quoteToken', type: 'STRING', mode: 'REQUIRED' },
  { name: 'oracleAddress', type: 'STRING', mode: 'REQUIRED' },
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
