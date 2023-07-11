import { TableField } from '@google-cloud/bigquery';
import { PRECISION, SCALE } from '../constants';
import { rawEventsBaseTableSchema } from '../common-table-support/rawEventsBaseTableSchema';

export const rawTakerOrderTableSchema: TableField[] = [
  ...rawEventsBaseTableSchema,

  { name: 'accountId', type: 'STRING', mode: 'REQUIRED' },
  { name: 'marketId', type: 'STRING', mode: 'REQUIRED' },
  { name: 'maturityTimestamp', type: 'INTEGER', mode: 'REQUIRED' },
  { name: 'quoteToken', type: 'INTEGER', mode: 'REQUIRED' },

  {
    name: 'executedBaseAmount',
    type: 'BIGNUMERIC',
    mode: 'REQUIRED',
    precision: PRECISION.toString(),
    scale: SCALE.toString(),
  },

  {
    name: 'executedQuoteAmount',
    type: 'BIGNUMERIC',
    mode: 'REQUIRED',
    precision: PRECISION.toString(),
    scale: SCALE.toString(),
  },

  {
    name: 'annualizedBaseAmount',
    type: 'BIGNUMERIC',
    mode: 'REQUIRED',
    precision: PRECISION.toString(),
    scale: SCALE.toString(),
  },
];
