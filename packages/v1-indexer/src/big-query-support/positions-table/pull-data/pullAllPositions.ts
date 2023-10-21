import { getBigQuery } from '../../../global';
import { mapToBigQueryPositionRow } from '../../mappers';
import { BigQueryPositionRow } from '../../types';
import { TableType, getTableFullID } from '../../utils';

export type TrackedBigQueryPositionRow = {
  position: BigQueryPositionRow;
  added: boolean;
  modified: boolean;
};

export const pullAllPositions = async (): Promise<
  TrackedBigQueryPositionRow[]
> => {
  const bigQuery = getBigQuery();

  const sqlQuery = `
    select as VALUE array_agg(t order by rowLastUpdatedTimestamp desc limit 1)[offset(0)] 
    from \`${getTableFullID(TableType.positions)}\` t 
    group by chainId, marginEngineAddress, ownerAddress, tickLower, tickUpper 
  `;

  const options = {
    query: sqlQuery,
  };

  const [rows] = await bigQuery.query(options);

  if (!rows || rows.length === 0) {
    return [];
  }

  const lpPositionRows = rows.map(
    (row): TrackedBigQueryPositionRow => ({
      position: mapToBigQueryPositionRow(row),
      added: false,
      modified: false,
    }),
  );

  return lpPositionRows;
};
