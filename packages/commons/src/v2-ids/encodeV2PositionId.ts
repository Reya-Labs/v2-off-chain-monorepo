import { V2PositionIdData } from './types';

export const encodeV2PositionId = ({
  chainId,
  accountId,
  marketId,
  maturityTimestamp,
  type: positionType,

  tickLower,
  tickUpper,
}: V2PositionIdData): string => {
  switch (positionType) {
    case 'trader': {
      return `${chainId}_${accountId}_${marketId}_${maturityTimestamp}_trader_v2`;
    }
    case 'lp': {
      if (tickLower === undefined || tickUpper === undefined) {
        throw new Error(`Ticks need to be passed for LP position IDs.`);
      }

      return `${chainId}_${accountId}_${marketId}_${maturityTimestamp}_lp_${tickLower}_${tickUpper}_v2`;
    }
    default: {
      positionType satisfies never;

      throw new Error(`Unrecognized position type`);
    }
  }
};
