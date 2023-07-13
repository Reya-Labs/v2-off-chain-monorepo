import { UpdateBatch, TableType } from '../../../types';
import { getTableFullName } from '../../../table-infra/getTableName';
import { VammCreatedEvent } from '../specific';

export const insertVammCreatedEvent = (
  environmentV2Tag: string,
  event: VammCreatedEvent,
): UpdateBatch => {
  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_vamm_created,
  );

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
    ${event.tick},
    ${event.priceImpactPhi},
    ${event.priceImpactBeta},
    ${event.spread},
    "${event.rateOracle}",
    "${event.maxLiquidityPerTick}",
    ${event.tickSpacing},
    ${event.maturityTimestamp}
  `;

  const sqlTransactionQuery = `INSERT INTO \`${tableName}\` VALUES (${row});`;
  return [sqlTransactionQuery];
};
