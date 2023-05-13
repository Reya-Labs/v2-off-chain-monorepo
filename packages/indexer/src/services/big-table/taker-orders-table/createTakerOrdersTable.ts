import { columnFamilyId, getTable, tableName } from './utils';

export const createTakerOrdersTable = async () => {
  const table = getTable();
  const [tableExists] = await table.exists();

  if (tableExists) {
    console.log(`Table ${tableName} already exists.`);
    return;
  }

  if (!tableExists) {
    console.log(`Creating table ${tableName}...`);
    const options = {
      families: [
        {
          name: columnFamilyId,
          rule: {
            versions: 1,
          },
        },
      ],
    };
    await table.create(options);
  }
};
