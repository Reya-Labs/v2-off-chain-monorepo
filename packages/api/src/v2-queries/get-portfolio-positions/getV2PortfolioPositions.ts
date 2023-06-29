import {
  SupportedChainId,
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

export const getV2PortfolioPositions = async (
  chainIds: SupportedChainId[],
  ownerAddress: string,
): Promise<V2PortfolioPosition[]> => {
  const accounts = await pullAccountsByAddress(
    getEnvironmentV2(),
    chainIds,
    ownerAddress,
  );

  const allPositionEntries: PositionEntry[] = [];

  for (const { chainId, accountId } of accounts) {
    const positionEntries = await pullAccountPositionEntries(
      getEnvironmentV2(),
      chainId,
      accountId,
    );

    allPositionEntries.push(...positionEntries);
  }

  const portfolio = await fetchMultiplePromises(
    allPositionEntries.map(buildV2PortfolioPosition),
  );

  return portfolio;
};
