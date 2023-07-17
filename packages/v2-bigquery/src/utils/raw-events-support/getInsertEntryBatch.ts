import { getTableFullName } from '../../table-infra/getTableName';
import { getTableSchema } from '../../table-infra/tableSchemas';
import { TableType, UpdateBatch } from '../../types';

// todo: entry type
export const getInsertEntryBatch = (
  environmentV2Tag: string,
  tableType: TableType,
  entry: Record<string, string | number>,
): UpdateBatch => {
  const tableName = getTableFullName(environmentV2Tag, tableType);
  const tableSchema = getTableSchema(tableType);

  const values: string[] = tableSchema.map(({ name: fieldName }): string => {
    if (fieldName === undefined || !Object.keys(entry).includes(fieldName)) {
      throw new Error(`Event ${entry} does not have field ${fieldName}.`);
    }

    const value = entry[fieldName as keyof typeof entry];

    switch (typeof value) {
      case 'string': {
        return `"${value}"`;
      }
      case 'number': {
        return `${value}`;
      }
      default: {
        throw new Error(`Type of ${value} is unexpected(${typeof value})`);
      }
    }
  });

  const row = values.join(',');
  const query = `INSERT INTO \`${tableName}\` VALUES (${row});`;

  return [query];
};
