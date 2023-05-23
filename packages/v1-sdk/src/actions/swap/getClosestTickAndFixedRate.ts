import {ClosestTickAndFixedRate} from "../types/priceAndRateTypes";
import { MAX_FIXED_RATE, MIN_FIXED_RATE } from "../../common/constants";
import { Price } from "../../common/math/price";
import {fixedRateToClosestTick, tickToFixedRate} from "../../common/math/priceTickConversions";
import {nearestUsableTick} from "../../common/math/nearestUsableTick";

export const getClosestTickAndFixedRate = (fixedRate: number, tickSpacing: number): ClosestTickAndFixedRate => {

  let inRangeFixedRate: number = fixedRate;
  if (fixedRate > MAX_FIXED_RATE) {
    inRangeFixedRate = MAX_FIXED_RATE
  }
  if (fixedRate < MIN_FIXED_RATE) {
    inRangeFixedRate = MIN_FIXED_RATE
  }

  const fixedRatePriceRepresentation: Price = Price.fromNumber(inRangeFixedRate);
  const closestTick: number = fixedRateToClosestTick(fixedRatePriceRepresentation);
  const closestUsableTick: number = nearestUsableTick(closestTick, tickSpacing);
  const closestUsableFixedRate: Price = tickToFixedRate(closestUsableTick);

  return {
    closestUsableTick,
    closestUsableFixedRate
  }
};
