import { V2PortfolioPosition } from '../../v2-queries/get-portfolio-positions/types';
import { extendV2Pool } from '../get-pools/extendV2Pool';
import { V1V2PortfolioPosition } from './types';

export const extendV2Position = (
  p: V2PortfolioPosition,
): V1V2PortfolioPosition => ({
  ...p,
  amm: extendV2Pool(p.amm),
});
