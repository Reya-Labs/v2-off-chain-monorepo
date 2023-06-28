import { getBigQuery } from '../client';
import { UpdateBatch } from '../types';

const CHARACTER_LIMIT = 1_000_000;

export const sendUpdateBatches = async (
  updateBatches: UpdateBatch[],
): Promise<void> => {
  const bigQuery = getBigQuery();

  const updates = updateBatches.flat();
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
    `Sending ${queries.length} queries to BigQuery (consisting of ${updates.length} operations)...`,
  );

  for (const query of queries) {
    const options = {
      query,
      timeoutMs: 100000,
      useLegacySql: false,
    };

    await bigQuery.query(options);
  }

  console.log(`Successfully sent ${queries.length} queries to BigQuery.`);
};
