import { PortfolioPositionV1 } from '../../v1-queries-new/get-portfolio-positions/types';
import { extendV1Pool } from '../get-pools/extendV1Pool';
import { PortfolioPositionV1V2 } from './types';

export const extendV1Position = (
  p: PortfolioPositionV1,
): PortfolioPositionV1V2 => ({
  ...p,
  amm: extendV1Pool(p.amm),
});
