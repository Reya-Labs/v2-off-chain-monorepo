import { BaseEvent } from '../../types';
import { bqNumericToNumber } from '../../utils/converters';
import { mapBaseRow } from '../../utils/mapBaseRow';

// state-capturing event
export type ProductPositionUpdatedEvent = BaseEvent & {
  accountId: string; // big number
  marketId: string; // big number
  maturityTimestamp: number;
  baseDelta: number;
  quoteDelta: number;
};

export const mapRow = (row: any): ProductPositionUpdatedEvent => ({
  ...mapBaseRow(row),

  accountId: row.accountId,
  marketId: row.marketId,
  maturityTimestamp: row.maturityTimestamp,

  baseDelta: bqNumericToNumber(row.baseDelta),
  quoteDelta: bqNumericToNumber(row.quoteDelta),
});
