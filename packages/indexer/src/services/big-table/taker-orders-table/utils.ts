import { Row, Table } from '@google-cloud/bigtable';
import { getBigtableInstance } from '../clients';
import { TakerOrderEvent } from '../../../event-parsers/types';
import { takerOrderEvent } from '../../../../tests/utils/mocks';

export const tableName = 'raw-taker-orders';
export const columnFamilyId = 'cf';

export const getTable = (): Table => {
  const instance = getBigtableInstance();

  const table = instance.table(tableName);
  return table;
};

export const mapBigtableRow = (row: Row): TakerOrderEvent => {
  return Object.keys(row.data[columnFamilyId]).reduce((acc, key) => {
    const valueAsString = row.data[columnFamilyId][key][0].value as string;
    const typeOfKey =
      typeof takerOrderEvent[key as keyof typeof takerOrderEvent];

    switch (typeOfKey) {
      case 'string': {
        return {
          ...acc,
          [key]: valueAsString,
        };
      }
      case 'number': {
        return {
          ...acc,
          [key]: Number(valueAsString),
        };
      }
      default: {
        throw new Error(`Unrecognized type ${typeOfKey}`);
      }
    }
  }, {}) as TakerOrderEvent;
};
