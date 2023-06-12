import { SECONDS_IN_YEAR } from '../constants';

export const getCashflowInfo = (
  net: {
    notional: number;
    cashflowLiFactor: number;
    cashflowTimeFactor: number;
    cashflowFreeTerm: number;
  },
  incoming: {
    notional: number;
    cashflowLiFactor: number;
    cashflowTimeFactor: number;
    cashflowFreeTerm: number;
  },
  maturityTimestamp: number,
): {
  notional: number;
  cashflowLiFactor: number;
  cashflowTimeFactor: number;
  cashflowFreeTerm: number;
} => {
  if (
    (net.notional >= 0 && incoming.notional >= 0) ||
    (net.notional <= 0 && incoming.notional <= 0)
  ) {
    // doubling down exposure

    return {
      notional: net.notional + incoming.notional,
      cashflowLiFactor: net.cashflowLiFactor + incoming.cashflowLiFactor,
      cashflowTimeFactor: net.cashflowTimeFactor + incoming.cashflowTimeFactor,
      cashflowFreeTerm: net.cashflowFreeTerm + incoming.cashflowFreeTerm,
    };
  }

  if (
    (net.notional >= 0 && net.notional + incoming.notional >= 0) ||
    (net.notional <= 0 && net.notional + incoming.notional <= 0)
  ) {
    // partial unwind

    // from net position
    const reducedTimeFactor =
      net.cashflowTimeFactor * (-incoming.notional / net.notional);

    const lockedInProfit =
      ((reducedTimeFactor + incoming.cashflowTimeFactor) * maturityTimestamp) /
      SECONDS_IN_YEAR;

    return {
      notional: net.notional + incoming.notional,
      cashflowLiFactor: net.cashflowLiFactor + incoming.cashflowLiFactor,
      cashflowTimeFactor: net.cashflowTimeFactor - reducedTimeFactor,
      cashflowFreeTerm:
        net.cashflowFreeTerm + incoming.cashflowFreeTerm + lockedInProfit,
    };
  }

  if (
    (net.notional >= 0 && net.notional + incoming.notional <= 0) ||
    (net.notional <= 0 && net.notional + incoming.notional >= 0)
  ) {
    // full unwind + take the other direction

    // from incoming position
    const reducedTimeFactor =
      incoming.cashflowTimeFactor * (-net.notional / incoming.notional);

    const lockedInProfit =
      ((net.cashflowTimeFactor + reducedTimeFactor) * maturityTimestamp) /
      SECONDS_IN_YEAR;

    return {
      notional: net.notional + incoming.notional,
      cashflowLiFactor: net.cashflowLiFactor + incoming.cashflowLiFactor,
      cashflowTimeFactor: incoming.cashflowTimeFactor - reducedTimeFactor,
      cashflowFreeTerm:
        net.cashflowFreeTerm + incoming.cashflowFreeTerm + lockedInProfit,
    };
  }

  throw new Error(`Could not reach here ${net.notional}, ${incoming.notional}`);
};
