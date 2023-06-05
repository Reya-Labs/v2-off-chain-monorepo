import { TableField } from '@google-cloud/bigquery';
import { PRECISION, SCALE } from '../../constants';

export const rawMarketFeeConfiguredTableSchema: TableField[] = [
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
