import { V1Pool } from '../../v1-queries/get-pools/types';
import { V1PortfolioPosition } from '../../v1-queries/get-portfolio-positions/types';
import { V2Pool } from '../../v2-queries/get-pools/types';
import { V2PortfolioPosition } from '../../v2-queries/get-portfolio-positions/types';

export type V1V2PortfolioPosition = V1PortfolioPosition &
  V2PortfolioPosition & {
    amm: V1Pool & V2Pool;
  };
