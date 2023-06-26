import { SupportedChainId } from '@voltz-protocol/commons-v2';

import {
  PositionEntry,
  pullAccountPositionEntries,
  pullAccountsByAddress,
} from '@voltz-protocol/bigquery-v2';
import { buildV2PortfolioPosition } from './buildV2PortfolioPosition';
import { V2PortfolioPosition } from '@voltz-protocol/api-v2-types';

export const getV2PortfolioPositions = async (
  chainIds: SupportedChainId[],
  ownerAddress: string,
): Promise<V2PortfolioPosition[]> => {
  const accounts = await pullAccountsByAddress(chainIds, ownerAddress);

  const allPositionEntries: PositionEntry[] = [];

  for (const { chainId, accountId } of accounts) {
    const positionEntries = await pullAccountPositionEntries(
      chainId,
      accountId,
    );

    allPositionEntries.push(...positionEntries);
  }

  const responses = await Promise.allSettled(
    allPositionEntries.map(buildV2PortfolioPosition),
  );

  const portfolio = responses.map((r) => {
    if (r.status === 'rejected') {
      throw r.reason;
    }

    return r.value;
  });

  return portfolio;
};
