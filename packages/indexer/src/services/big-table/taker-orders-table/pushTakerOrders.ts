import { TakerOrderEvent } from '../../../event-parsers/types';
import { columnFamilyId, getTable } from './utils';

export const pushTakerOrders = async (
  items: TakerOrderEvent[],
): Promise<void> => {
  const table = getTable();

  const rows = items.map((item) => {
    const data: object = Object.keys(item).reduce(
      (acc: object, curr: string) => ({
        ...acc,
        [curr]: {
          value: item[curr as keyof typeof item].toString(),
        },
      }),
      {},
    );

    return {
      key: item.id,
      data: {
        [columnFamilyId]: data,
      },
    };
  });

  await table.insert(rows);
};
