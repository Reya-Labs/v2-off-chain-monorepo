import { ClosestTickAndFixedRate } from '../../actions/types/priceAndRateTypes';
import { MAX_FIXED_RATE, MIN_FIXED_RATE } from '../constants';
import { Price } from './price';
import {
  fixedRateToClosestTick,
  tickToFixedRate,
} from './priceTickConversions';
import { nearestUsableTick } from './nearestUsableTick';

export const getClosestTickAndFixedRate = (
  fixedRate: number,
  tickSpacing: number,
): ClosestTickAndFixedRate => {
  let inRangeFixedRate: number = fixedRate;
  if (fixedRate > MAX_FIXED_RATE) {
    inRangeFixedRate = MAX_FIXED_RATE;
  }
  if (fixedRate < MIN_FIXED_RATE) {
    inRangeFixedRate = MIN_FIXED_RATE;
  }

  const fixedRatePriceRepresentation: Price =
    Price.fromNumber(inRangeFixedRate);
  const closestTick: number = fixedRateToClosestTick(
    fixedRatePriceRepresentation,
  );
  const closestUsableTick: number = nearestUsableTick(closestTick, tickSpacing);
  const closestUsableFixedRate: Price = tickToFixedRate(closestUsableTick);

  return {
    closestUsableTick,
    closestUsableFixedRate,
  };
};
