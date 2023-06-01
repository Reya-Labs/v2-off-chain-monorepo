import { VammCreatedEvent } from '../../../../event-parsers/types';
import { getBigQuery } from '../../client';
import { getTableFullName } from '../../utils/getTableName';

export const insertVammCreatedEvent = async (
  event: VammCreatedEvent,
): Promise<void> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName('vamm_config');

  const row = `
    "${event.id}",
    "${event.type}",
    ${event.chainId},
    "${event.source}",
    ${event.blockTimestamp}, 
    ${event.blockNumber}, 
    "${event.blockHash}",
    ${event.transactionIndex}, 
    "${event.transactionHash}", 
    ${event.logIndex},
    "${event.marketId}", 
    ${event.priceImpactPhi},
    ${event.priceImpactBeta},
    ${event.spread},
    "${event.rateOracle}",
    ${event.maxLiquidityPerTick},
    ${event.tickSpacing},
    ${event.maturityTimestamp}
  `;

  // build and fire sql query
  const sqlTransactionQuery = `INSERT INTO \`${tableName}\` VALUES (${row});`;

  const options = {
    query: sqlTransactionQuery,
    timeoutMs: 100000,
    useLegacySql: false,
  };

  await bigQuery.query(options);
};
