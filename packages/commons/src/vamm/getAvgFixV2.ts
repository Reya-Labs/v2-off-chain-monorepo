// base
// quote = - base * li * (1 + avgFix * (maturity-entry) / YEAR)
// avgFix = (-quote / base / li - 1) / ((maturity - entry) / YEAR)

import { SECONDS_IN_YEAR } from '../constants';

export type GetAvgFixV2Args = {
  base: number;
  quote: number;
  liquidityIndex: number;
  entryTimestamp: number; // in seconds
  maturityTimestamp: number; // in seconds
};

export const getAvgFixV2 = ({
  base,
  quote,
  liquidityIndex,
  entryTimestamp,
  maturityTimestamp,
}: GetAvgFixV2Args): number => {
  const timeDelta = (maturityTimestamp - entryTimestamp) / SECONDS_IN_YEAR;
  const notional = base * liquidityIndex;
  const avgFix = (-quote / notional - 1) / timeDelta / 100;

  return avgFix;
};
