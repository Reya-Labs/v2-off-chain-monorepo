import { getLpInfoInRange } from '@voltz-protocol/commons-v2';
import { pullLpPositionEntries } from './pullLpPositionEntries';

export const getAvailableBaseInRange = async (
  environmentV2Tag: string,
  chainId: number,
  marketId: string,
  maturityTimestamp: number,
  a: number,
  b: number,
): Promise<number> => {
  const lpPositions = await pullLpPositionEntries(
    environmentV2Tag,
    chainId,
    marketId,
    maturityTimestamp,
  );

  const { base } = getLpInfoInRange(lpPositions, a, b);

  return base;
};
