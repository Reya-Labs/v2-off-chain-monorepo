import { SECONDS_IN_YEAR } from './constants';

export const computeRealizedPnL = ({
  base,
  timeDependentQuote,
  freeQuote,
  queryTimestamp,
  liquidityIndexAtQuery,
}: {
  base: number;
  timeDependentQuote: number;
  freeQuote: number;
  queryTimestamp: number;
  liquidityIndexAtQuery: number;
}) => {
  return (
    base * liquidityIndexAtQuery +
    (timeDependentQuote * queryTimestamp) / SECONDS_IN_YEAR +
    freeQuote
  );
};
