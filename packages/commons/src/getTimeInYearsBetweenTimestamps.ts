import { SECONDS_IN_YEAR } from './constants';

export const getTimeInYearsBetweenTimestamps = (
  from: number,
  to: number,
): number => {
  if (from > to) {
    throw new Error(`Unordered timestamps ${from}-${to}`);
  }

  return (to - from) / SECONDS_IN_YEAR;
};
