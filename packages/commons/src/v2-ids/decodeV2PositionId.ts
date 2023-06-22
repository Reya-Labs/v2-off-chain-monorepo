import { V2PositionIdData } from './types';

export const decodeV2PositionId = (positionId: string): V2PositionIdData => {
  const parts = positionId.split('_');

  if (parts.length < 5) {
    throw new Error(`Invalid position ID: ${positionId}`);
  }

  const chainId = Number(parts[0]);
  const accountId = parts[1];
  const marketId = parts[2];
  const maturityTimestamp = Number(parts[3]);
  const type = parts[4];

  switch (type) {
    case 'trader': {
      if (!(parts.length === 5)) {
        throw new Error(`Invalid trader position ID: ${positionId}`);
      }

      return {
        chainId,
        accountId,
        marketId,
        maturityTimestamp,
        type,
      };
    }
    case 'lp': {
      if (!(parts.length === 7)) {
        throw new Error(`Invalid lp position ID: ${positionId}`);
      }

      const tickLower = Number(parts[5]);
      const tickUpper = Number(parts[6]);

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
      throw new Error(`Invalid position ID: ${positionId}`);
    }
  }
};
