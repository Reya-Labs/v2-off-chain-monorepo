import { Price } from '../../common/math/price';

// todo: move to common
export type ClosestTickAndFixedRate = {
  closestUsableTick: number;
  closestUsableFixedRate: Price;
};
