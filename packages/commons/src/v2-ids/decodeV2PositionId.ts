import { assert } from '../assert';
import { V2PositionIdData } from './types';

export const decodeV2PositionId = (positionId: string): V2PositionIdData => {
  const parts = positionId.split('_');

  assert(parts.length >= 5, `Invalid v2 position ID: ${positionId}`);

  const chainId = Number(parts[0]);
  const accountId = parts[1];
  const marketId = parts[2];
  const maturityTimestamp = Number(parts[3]);
  const type = parts[4];

  assert(
    !isNaN(chainId) &&
      !isNaN(maturityTimestamp) &&
      (type === 'trader' || type === 'lp'),
    `Invalid v2 position ID: ${positionId}`,
  );

  switch (type) {
    case 'trader': {
      assert(
        parts.length === 6,
        `Invalid trader v2 position ID: ${positionId}`,
      );

      const tag = parts[5].toLowerCase();

      assert(tag === 'v2', `Invalid trader v2 position ID: ${positionId}`);

      return {
        chainId,
        accountId,
        marketId,
        maturityTimestamp,
        type,
      };
    }
    case 'lp': {
      assert(parts.length === 8, `Invalid lp v2 position ID: ${positionId}`);

      const tickLower = Number(parts[5]);
      const tickUpper = Number(parts[6]);
      const tag = parts[7].toLowerCase();

      assert(
        !isNaN(tickLower) && !isNaN(tickUpper) && tag === 'v2',
        `Invalid v2 lp position ID: ${positionId}`,
      );

      return {
        chainId,
        accountId,
        marketId,
        maturityTimestamp,
        type,
        tickLower,
        tickUpper,
      };
    }

    default: {
      throw new Error(`Invalid v2 position ID: ${positionId}`);
    }
  }
};
