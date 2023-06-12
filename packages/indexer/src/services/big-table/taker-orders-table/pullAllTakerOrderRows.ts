import { TakerOrderEvent } from '@voltz-protocol/bigquery-v2';
import { getTable, mapBigtableRow } from './utils';

export const pullAllTakerOrderRows = async (): Promise<TakerOrderEvent[]> => {
  const table = getTable();

  const filter = [
    {
      column: {
        cellLimit: 1, // Only retrieve the most recent version of the cell.
      },
    },
  ];

  const [allRows] = await table.getRows({ filter });

  return allRows.map(mapBigtableRow);
};
