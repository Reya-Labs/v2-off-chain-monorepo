import { pullExistingPoolRow } from '../big-query-support/pools-table/pull-data/pullExistingPoolRow';
import { insertNewPool } from '../big-query-support/pools-table/push-data/insertNewPool';
import { IrsInstanceEventInfo } from '../common/event-parsers/types';

export const processIrsInstanceEvent = async (
  event: IrsInstanceEventInfo,
): Promise<void> => {
  const poolRow = await pullExistingPoolRow(event.vamm, event.chainId);

  if (poolRow) {
    return;
  }

  await insertNewPool(event);
};
