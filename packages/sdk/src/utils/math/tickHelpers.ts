import { Fraction } from '@uniswap/sdk-core';
import {
  MAX_FIXED_RATE,
  MAX_TICK,
  MIN_FIXED_RATE,
  MIN_TICK,
  Q192,
  TICK_SPACING,
} from './constants';
import Fractionjs from 'fraction.js';
import { encodeSqrtRatioX96, TickMath } from '@uniswap/v3-sdk';
import invariant from 'tiny-invariant';
import JSBI from 'jsbi';

export type ClosestTickAndFixedRate = {
  closestUsableTick: number;
  closestUsableFixedRate: Fraction;
};

export function closestTickAndFixedRate(
  fixedRate: number,
): ClosestTickAndFixedRate {
  const inRangeFixedRate = Math.min(
    Math.max(fixedRate, MIN_FIXED_RATE),
    MAX_FIXED_RATE,
  );

  const fixedRatePrice = fractionFromNumber(inRangeFixedRate);
  const closestTick: number = fixedRateToClosestTick(fixedRatePrice);
  const closestUsableTick: number = nearestUsableTick(
    closestTick,
    TICK_SPACING,
  );
  const closestUsableFixedRate: Fraction =
    tickToFixedRateFraction(closestUsableTick);

  return {
    closestUsableTick,
    closestUsableFixedRate,
  };
}

function fixedRateToClosestTick(fixedRate: Fraction) {
  // fixed rate to price
  const price = fixedRateToPriceFraction(fixedRate);
  // price to closest tick
  return priceToClosestTick(price);
}

function fixedRateToPriceFraction(fixedRate: Fraction) {
  // the fixed rate is the reciprocal of the price
  // NOTE: below the first argument to the Price constructor is the denominator and the second argument is the numerator
  return new Fraction(fixedRate.numerator, fixedRate.denominator);
}

function priceToFixedRate(price: Fraction) {
  return new Fraction(price.numerator, price.denominator);
}

/**
 * Returns the first tick for which the given price is greater than or equal to the tick price
 * @param price for which to return the closest tick that represents a price less than or equal to the input price,
 * i.e. the price of the returned tick is less than or equal to the input price
 */
function priceToClosestTick(price: Fraction): number {
  const sqrtRatioX96 = encodeSqrtRatioX96(
    price.numerator.toString(),
    price.denominator.toString(),
  );

  let tick = TickMath.getTickAtSqrtRatio(sqrtRatioX96);

  const nextTickPrice = tickToPrice(tick + 1);

  // this solution is a bit hacky, can be optimised
  if (tick < 0) {
    if (!price.lessThan(nextTickPrice)) {
      tick += 1;
    }
  }

  return tick;
}

/**
 * Returns a price object corresponding to the input tick
 * Inputs must be tokens because the address order is used to interpret the price represented by the tick
 * @param baseToken the base token of the price
 * @param quoteToken the quote token of the price
 * @param tick the tick for which to return the price
 */
function tickToPrice(tick: number) {
  const sqrtRatioX96 = TickMath.getSqrtRatioAtTick(tick);

  const ratioX192 = JSBI.multiply(sqrtRatioX96, sqrtRatioX96);

  return new Fraction(Q192.toString(), ratioX192.toString());
}

function fractionFromNumber(value: number | string) {
  const fraction = new Fractionjs(value);
  return new Fraction(
    (fraction.n * fraction.s).toString(),
    fraction.d.toString(),
  );
}

/**
 * Returns the closest tick that is nearest a given tick and usable for the given tick spacing
 * @param tick the target tick
 * @param tickSpacing the spacing of the pool
 */
function nearestUsableTick(tick: number, tickSpacing: number) {
  invariant(
    Number.isInteger(tick) && Number.isInteger(tickSpacing),
    'INTEGERS',
  );
  invariant(tickSpacing > 0, 'TICK_SPACING');
  invariant(
    tick >= TickMath.MIN_TICK && tick <= TickMath.MAX_TICK,
    'TICK_BOUND',
  );
  const rounded = Math.round(tick / tickSpacing) * tickSpacing;
  if (rounded < TickMath.MIN_TICK) return rounded + tickSpacing;
  if (rounded > TickMath.MAX_TICK) return rounded - tickSpacing;
  return rounded;
}

/**
 * Returns a price object corresponding to the input tick, the price object represents the fixed rate in percentage point (e.g. 1.2 corresponds to 1.2% --> 0.012)
 * Inputs must be tokens because the address order is used to interpret the price represented by the tick
 * @param baseToken the base token of the price
 * @param quoteToken the quote token of the price
 * @param tick the tick for which to return the price
 */
function tickToFixedRateFraction(tick: number) {
  let inRangeTick = tick;
  if (tick < MIN_TICK) {
    inRangeTick = MIN_TICK;
  }
  if (tick > MAX_TICK) {
    inRangeTick = MAX_TICK;
  }

  const price: Fraction = tickToPrice(inRangeTick);

  return priceToFixedRate(price);
}

export function fixedRateToPrice(fixedRate: number): string {
  const { closestUsableTick: tick } = closestTickAndFixedRate(fixedRate);
  return TickMath.getSqrtRatioAtTick(tick).toString();
}

export function tickToFixedRate(tick: number): number {
  return 1.0001 ** -tick;
}
