import {
  SwapArgs
} from "../actions/actionArgTypes";

export const handleSwapErrors = ({
    isFT,
    notional,
    margin,
    fixedRateLimit,
    fixedLow,
    fixedHigh,
  underlyingTokenId,
  }: SwapArgs
): void =>  {
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

  if (!underlyingTokenId) {
    throw new Error('No underlying error');
  }

}
