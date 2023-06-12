import { getBigQuery } from '../global';

const CHARACTER_LIMIT = 1_000_000;

export const sendQueriesInBatches = async (
  processName: string,
  updates: string[],
) => {
  const bigQuery = getBigQuery();

  const queries: string[] = [];

  updates.forEach((u) => {
    if (
      queries.length === 0 ||
      queries[queries.length - 1].length + u.length > CHARACTER_LIMIT
    ) {
      queries.push(u);
    } else {
      queries[queries.length - 1] = queries[queries.length - 1].concat(u);
    }
  });

  console.log(
    `${processName}: Sending ${queries.length} queries to BigQuery (inserting/updating ${updates.length} entries)...`,
  );

  for (const query of queries) {
    const options = {
      query,
      timeoutMs: 100000,
      useLegacySql: false,
    };

    await bigQuery.query(options);
  }
};
