import {
  V2PortfolioPosition,
  V1V2PortfolioPosition,
  V2PortfolioPositionDetails,
  V1V2PortfolioPositionDetails,
} from '@voltz-protocol/api-sdk-v2';
import { extendV2Pool } from '../get-pools/extendV2Pool';

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
});
