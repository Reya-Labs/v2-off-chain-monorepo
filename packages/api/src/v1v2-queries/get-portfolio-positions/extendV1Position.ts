import {
  V1PortfolioPosition,
  V1V2PortfolioPosition,
  V1PortfolioPositionDetails,
  V1V2PortfolioPositionDetails,
} from '@voltz-protocol/api-v2-types';
import { extendV1Pool } from '../get-pools/extendV1Pool';

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
