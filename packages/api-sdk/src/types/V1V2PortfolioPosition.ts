import {
  V1PortfolioPosition,
  V1PortfolioPositionDetails,
} from './V1PortfolioPosition';
import { V1V2Pool } from './V1V2Pool';
import {
  V2PortfolioPosition,
  V2PortfolioPositionDetails,
} from './V2PortfolioPosition';

export type V1V2PortfolioPosition = V1PortfolioPosition &
  V2PortfolioPosition & {
    pool: V1V2Pool;
  };

export type V1V2PortfolioPositionDetails = V1PortfolioPositionDetails &
  V2PortfolioPositionDetails & {
    pool: V1V2Pool;
  };
