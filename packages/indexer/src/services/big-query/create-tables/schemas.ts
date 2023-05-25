import { TableField } from '@google-cloud/bigquery';
import { PRECISION, SCALE } from '../constants';
import { TableType } from '../types';

const collateralUpdatesTableSchema: TableField[] = [
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

  { name: 'accountId', type: 'STRING', mode: 'REQUIRED' },
  { name: 'collateralType', type: 'STRING', mode: 'REQUIRED' },

  {
    name: 'collateralAmount',
    type: 'BIGNUMERIC',
    mode: 'REQUIRED',
    precision: PRECISION.toString(),
    scale: SCALE.toString(),
  },

  {
    name: 'liquidatorBoosterAmount',
    type: 'BIGNUMERIC',
    mode: 'REQUIRED',
    precision: PRECISION.toString(),
    scale: SCALE.toString(),
  },
];

const liquidityIndicesTableSchema: TableField[] = [
  { name: 'chainId', type: 'INTEGER', mode: 'REQUIRED' },
  { name: 'blockNumber', type: 'INTEGER', mode: 'REQUIRED' },
  { name: 'blockTimestamp', type: 'INTEGER', mode: 'REQUIRED' },
  { name: 'oracleAddres', type: 'STRING', mode: 'REQUIRED' },

  {
    name: 'liquidityIndex',
    type: 'BIGNUMERIC',
    mode: 'REQUIRED',
    precision: PRECISION.toString(),
    scale: SCALE.toString(),
  },
];

const rateOraclesTableSchema: TableField[] = [];

export const getTableSchema = (tableType: TableType): TableField[] => {
  switch (tableType) {
    case 'collateral_updates': {
      return collateralUpdatesTableSchema;
    }

    case 'rate_oracles': {
      return rateOraclesTableSchema;
    }

    case 'liquidity_indices': {
      return liquidityIndicesTableSchema;
    }

    default: {
      throw new Error(`Unrecognized table.`);
    }
  }
};
