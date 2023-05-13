import { getTable, tableName } from './utils';

export const deleteTakerOrdersTable = async () => {
  const table = getTable();
  const [tableExists] = await table.exists();

  if (!tableExists) {
    console.log(`${tableName} does not exist.`);
  }

  console.log(`Deleting table ${tableName}...`);
  await table.delete();
};
