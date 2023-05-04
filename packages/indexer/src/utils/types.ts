export type EventType = 'taker-order';

export interface BaseEvent {
  id: string;
  type: EventType;

  chainId: number;
  source: string;

  blockTimestamp: number;
  blockNumber: number;
  blockHash: string;

  transactionIndex: number;
  transactionHash: string;
  logIndex: number;
}

export interface TakerOrderEvent extends BaseEvent {
  accountId: string;

  marketId: string;
  maturityTimestamp: number;
  quoteToken: string;

  executedBaseAmount: number;
  executedQuoteAmount: number;

  annualizedBaseAmount: number;
}
