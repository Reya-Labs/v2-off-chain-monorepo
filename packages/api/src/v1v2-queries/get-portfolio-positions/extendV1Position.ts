import {
  V1PortfolioPosition,
  V1PortfolioPositionDetails,
} from '../../v1-queries/get-portfolio-positions/types';
import { extendV1Pool } from '../get-pools/extendV1Pool';
import { V1V2PortfolioPosition, V1V2PortfolioPositionDetails } from './types';

export const extendV1Position = (
  p: V1PortfolioPosition,
): V1V2PortfolioPosition => ({
  ...p,
  accountId: '',
  pool: extendV1Pool(p.pool),
});

export const extendV1PositionDetails = (
  p: V1PortfolioPositionDetails,
): V1V2PortfolioPositionDetails => ({
  ...p,
  accountId: '',
  pool: extendV1Pool(p.pool),
  rolloverMaturityTimestamp: null,
});
