import {
  convertToAddress,
  fetchMultiplePromises,
} from '@voltz-protocol/commons-v2';

import {
  PositionEntry,
  pullAccountPositionEntries,
  pullAccountsByAddress,
} from '@voltz-protocol/bigquery-v2';
import { buildV2PortfolioPosition } from './buildV2PortfolioPosition';
import { V2PortfolioPosition } from '@voltz-protocol/api-v2-types';
import { getEnvironmentV2 } from '../../services/envVars';

// todo: combine SQL query that joins accounts and positions table

export const getV2PortfolioPositions = async (
  chainIds: number[],
  ownerAddress: string,
): Promise<V2PortfolioPosition[]> => {
  const accounts = await pullAccountsByAddress(
    getEnvironmentV2(),
    chainIds,
    convertToAddress(ownerAddress),
  );

  const allPositionEntries: PositionEntry[] = [];

  for (const { chainId, accountId } of accounts) {
    const positionEntries = await pullAccountPositionEntries(
      getEnvironmentV2(),
      chainId,
      accountId,
    );

    console.log(`${positionEntries.length} positions per account ${accountId}`);

    allPositionEntries.push(...positionEntries);
  }

  const { data: portfolio } = await fetchMultiplePromises(
    allPositionEntries.map(buildV2PortfolioPosition),
  );

  return portfolio;
};
