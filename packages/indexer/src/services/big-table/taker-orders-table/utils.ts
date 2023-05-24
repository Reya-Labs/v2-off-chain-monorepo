import { Row, Table } from '@google-cloud/bigtable';
import { getBigtableInstance } from '../clients';
import { TakerOrderEvent } from '../../../event-parsers/types';

export const tableName = 'raw-taker-orders';
export const columnFamilyId = 'cf';

export const getTable = (): Table => {
  const instance = getBigtableInstance();

  const table = instance.table(tableName);
  return table;
};

export const mapBigtableRow = (row: Row): TakerOrderEvent => {
  return {
    id: row.data[columnFamilyId]['id'][0].value,
    type: row.data[columnFamilyId]['type'][0].value,

    chainId: Number(row.data[columnFamilyId]['chainId'][0].value),
    source: row.data[columnFamilyId]['source'][0].value,

    blockTimestamp: Number(row.data[columnFamilyId]['blockTimestamp'][0].value),
    blockNumber: Number(row.data[columnFamilyId]['blockNumber'][0].value),
    blockHash: row.data[columnFamilyId]['blockHash'][0].value,

    transactionIndex: Number(
      row.data[columnFamilyId]['transactionIndex'][0].value,
    ),
    transactionHash: row.data[columnFamilyId]['transactionHash'][0].value,
    logIndex: Number(row.data[columnFamilyId]['logIndex'][0].value),

    accountId: row.data[columnFamilyId]['accountId'][0].value,

    marketId: row.data[columnFamilyId]['marketId'][0].value,
    maturityTimestamp: Number(
      row.data[columnFamilyId]['maturityTimestamp'][0].value,
    ),
    quoteToken: row.data[columnFamilyId]['quoteToken'][0].value,

    executedBaseAmount: Number(
      row.data[columnFamilyId]['executedBaseAmount'][0].value,
    ),
    executedQuoteAmount: Number(
      row.data[columnFamilyId]['executedQuoteAmount'][0].value,
    ),

    annualizedBaseAmount: Number(
      row.data[columnFamilyId]['annualizedBaseAmount'][0].value,
    ),
  };
};
