import { parseTakerOrder } from '../../src/event-parsers/dated-irs-vamm/takerOrder';
import { compareEvents } from '../utils/compareEvents';
import { TakerOrderEvent } from '@voltz-protocol/commons-v2';
import { takerOrderEvmEvent } from '../utils/evmEventMocks';

describe('taker order parser', () => {
  test('usual event', () => {
    const chainId = 1;

    const takerOrderEvent: TakerOrderEvent = {
      id: '1_taker-order_Block-Hash_0x2ef67d6f04295106894d762e66c6fd39ba36c02d43dac503df0bc7272803f40A_123',
      type: 'taker-order',

      chainId: 1,
      source: '0xe9a6569995f3d8ec971f1d314e0e832c38a735cc',

      blockTimestamp: 1683092975,
      blockNumber: 17178234,
      blockHash: 'Block-Hash',

      transactionIndex: 21,
      transactionHash:
        '0x2ef67d6f04295106894d762e66c6fd39ba36c02d43dac503df0bc7272803f40A',
      logIndex: 123,

      accountId: '1000000000',

      marketId: '1111111111',
      maturityTimestamp: 1685534400,
      quoteToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',

      executedBaseAmount: 100,
      executedQuoteAmount: -550,

      annualizedBaseAmount: 7.5,
    };

    const outputTakerOrderEvent = parseTakerOrder(chainId, takerOrderEvmEvent);

    expect(compareEvents(outputTakerOrderEvent, takerOrderEvent)).toBe(null);
  });
});
