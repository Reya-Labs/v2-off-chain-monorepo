import {
  encodeV2PositionId,
  V2PositionIdData,
} from '@voltz-protocol/commons-v2';
import { getBigQuery } from '../../../client';
import { mapRow, PositionEntry } from '../specific';
import { TableType } from '../../../types';
import { getTableFullName } from '../../../table-infra/getTableName';

export const pullPositionEntry = async (
  environmentV2Tag: string,
  idData: V2PositionIdData,
): Promise<PositionEntry | null> => {
  const bigQuery = getBigQuery();

  const tableName = getTableFullName(environmentV2Tag, TableType.positions);

  const id = encodeV2PositionId(idData);
  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE id="${id}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapRow(rows[0]);
};
