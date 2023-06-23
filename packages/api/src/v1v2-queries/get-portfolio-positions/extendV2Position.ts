import {
  V2PortfolioPosition,
  V2PortfolioPositionDetails,
} from '../../v2-queries/get-portfolio-positions/types';
import { extendV2Pool } from '../get-pools/extendV2Pool';
import { V1V2PortfolioPosition, V1V2PortfolioPositionDetails } from './types';

export const extendV2Position = (
  p: V2PortfolioPosition,
): V1V2PortfolioPosition => ({
  ...p,
  pool: extendV2Pool(p.pool),
});

export const extendV2PositionDetails = (
  p: V2PortfolioPositionDetails,
): V1V2PortfolioPositionDetails => ({
  ...p,
  pool: extendV2Pool(p.pool),
  rolloverPoolId: null,
});
