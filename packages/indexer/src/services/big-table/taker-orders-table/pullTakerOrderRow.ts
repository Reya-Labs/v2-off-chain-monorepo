import { TakerOrderEvent } from '../../../event-parsers/types';
import { getTable, mapBigtableRow } from './utils';

export const pullTakerOrderRow = async (
  rowKey: string,
): Promise<TakerOrderEvent> => {
  const table = getTable();

  const filter = [
    {
      column: {
        cellLimit: 1, // Only retrieve the most recent version of the cell.
      },
    },
  ];

  const [singleRow] = await table.row(rowKey).get({ filter });

  return mapBigtableRow(singleRow);
};
