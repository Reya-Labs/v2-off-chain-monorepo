import { V1Pool } from '../../v1-queries-new/get-pools/types';
import { PortfolioPositionV1 } from '../../v1-queries-new/get-portfolio-positions/types';
import { V2Pool } from '../../v2-queries/get-pools/types';
import { PortfolioPositionV2 } from '../../v2-queries/get-portfolio-positions/types';

export type PortfolioPositionV1V2 = PortfolioPositionV1 &
  PortfolioPositionV2 & {
    amm: V1Pool & V2Pool;
  };
