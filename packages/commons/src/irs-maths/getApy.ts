import { SECONDS_IN_YEAR } from '../constants';

export const getApy = (
  from: {
    index: number;
    timestamp: number;
  },
  to: {
    index: number;
    timestamp: number;
  },
  method: 'compounding' | 'linear',
): number => {
  // Validations

  if (from.timestamp >= to.timestamp) {
    throw new Error(
      `Invalid timestamps when getting APY ([${from.timestamp}, ${to.timestamp}]).`,
    );
  }

  if (from.index > to.index || from.index < 1) {
    throw new Error(
      `Invalid indices when getting APY ([${from.index}, ${to.index}]).`,
    );
  }

  // Calculations

  const timeFactor = SECONDS_IN_YEAR / (to.timestamp - from.timestamp);

  switch (method) {
    case 'linear': {
      const apy = (to.index - from.index) * timeFactor;
      return apy;
    }
    case 'compounding': {
      const apy = Math.pow(to.index / from.index, timeFactor) - 1;
      return apy;
    }
  }
};
