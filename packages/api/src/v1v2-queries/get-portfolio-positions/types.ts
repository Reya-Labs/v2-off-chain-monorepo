import { V1Pool } from '../../v1-queries/get-pools/types';
import {
  V1PortfolioPosition,
  V1PortfolioPositionDetails,
} from '../../v1-queries/get-portfolio-positions/types';
import { V2Pool } from '../../v2-queries/get-pools/types';
import {
  V2PortfolioPosition,
  V2PortfolioPositionDetails,
} from '../../v2-queries/get-portfolio-positions/types';

export type V1V2PortfolioPosition = V1PortfolioPosition &
  V2PortfolioPosition & {
    pool: V1Pool & V2Pool;
  };

export type V1V2PortfolioPositionDetails = V1PortfolioPositionDetails &
  V2PortfolioPositionDetails & {
    pool: V1Pool & V2Pool;
  };
