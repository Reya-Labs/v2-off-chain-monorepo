import { BasePortfolioPosition } from './BasePortfolioPosition';
import { HistoryTransaction } from './HistoryTransaction';
import { V2Pool } from './V2Pool';

export type V2PortfolioPosition = BasePortfolioPosition & {
  accountId: string;
  pool: V2Pool;
};

export type V2PortfolioPositionDetails = V2PortfolioPosition & {
  canEdit: boolean;
  canSettle: boolean;
  rolloverMaturityTimestamp: null | number;

  history: HistoryTransaction[];
};
