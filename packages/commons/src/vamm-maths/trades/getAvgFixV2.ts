import { SECONDS_IN_YEAR } from '../../constants';

export type GetAvgFixV2Args = {
  base: number;
  quote: number;
  liquidityIndex: number;
  entryTimestamp: number; // in seconds
  maturityTimestamp: number; // in seconds
};

/**
 * Calculates the average fixed rate of a trade.
 */
export const getAvgFixV2 = ({
  base,
  quote,
  liquidityIndex,
  entryTimestamp,
  maturityTimestamp,
}: GetAvgFixV2Args): number => {
  const timeDelta = (maturityTimestamp - entryTimestamp) / SECONDS_IN_YEAR;
  const notional = base * liquidityIndex;

  if (timeDelta <= 0 || notional === 0) {
    return 0;
  }

  const avgFix = (-quote / notional - 1) / timeDelta / 100;

  return avgFix;
};
