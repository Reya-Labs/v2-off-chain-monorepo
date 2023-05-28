import { LpValidateArgs } from '../types/actionErrorHandleArgTypes';

import { MAX_FIXED_RATE, MIN_FIXED_RATE } from '../../common/constants';

export const handleLpErrors = ({
                                 notional,
                                fixedLow,
                                fixedHigh,
                                 }: LpValidateArgs): void => {

  if (fixedLow >= fixedHigh) {
    throw new Error('Lower Rate must be smaller than Upper Rate');
  }

  if (fixedLow < MIN_FIXED_RATE) {
    throw new Error('Lower Rate is too low');
  }

  if (fixedHigh > MAX_FIXED_RATE) {
    throw new Error('Upper Rate is too high');
  }

  if (notional <= 0) {
    throw new Error('Amount of notional must be greater than 0');
  }

};
