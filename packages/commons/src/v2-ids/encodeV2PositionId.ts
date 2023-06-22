import { V2PositionIdData } from './types';

export const encodeV2PositionId = ({
  chainId,
  accountId,
  marketId,
  maturityTimestamp,
  type,

  tickLower,
  tickUpper,
}: V2PositionIdData): string => {
  switch (type) {
    case 'trader': {
      return `${chainId}_${accountId}_${marketId}_${maturityTimestamp}_trader_v2`;
    }
    case 'lp': {
      return `${chainId}_${accountId}_${marketId}_${maturityTimestamp}_lp_${tickLower}_${tickUpper}_v2`;
    }
  }
};
