import { V1PortfolioPosition } from '../../v1-queries/get-portfolio-positions/types';
import { extendV1Pool } from '../get-pools/extendV1Pool';
import { V1V2PortfolioPosition } from './types';

export const extendV1Position = (
  p: V1PortfolioPosition,
): V1V2PortfolioPosition => ({
  ...p,
  amm: extendV1Pool(p.amm),
});
