import { PortfolioPositionV2 } from '../../v2-queries/get-portfolio-positions/types';
import { extendV2Pool } from '../get-pools/extendV2Pool';
import { PortfolioPositionV1V2 } from './types';

export const extendV2Position = (
  p: PortfolioPositionV2,
): PortfolioPositionV1V2 => ({
  ...p,
  amm: extendV2Pool(p.amm),
});
