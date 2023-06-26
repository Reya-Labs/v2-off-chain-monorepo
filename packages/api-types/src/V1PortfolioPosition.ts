import { BasePortfolioPosition } from './BasePortfolioPosition';
import { HistoryTransaction } from './HistoryTransaction';
import { V1Pool } from './V1Pool';

export type V1PortfolioPosition = BasePortfolioPosition & {
  pool: V1Pool;
};

export type V1PortfolioPositionDetails = V1PortfolioPosition & {
  canEdit: boolean;
  canSettle: boolean;
  rolloverPoolId: null | string;

  history: HistoryTransaction[];
};
