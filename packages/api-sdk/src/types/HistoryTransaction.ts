export type HistoryTransaction = {
  type:
    | 'swap'
    | 'mint'
    | 'burn'
    | 'margin-update'
    | 'liquidation'
    | 'settlement'
    | 'maturity';
  creationTimestampInMS: number;
  notional: number;
  paidFees: number;
  fixedRate: number;
  marginDelta: number;
};
