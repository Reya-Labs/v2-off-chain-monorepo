import { BigNumber, Event } from 'ethers';
import { parseTakerOrder } from '../../src/event-parsers/dated-irs-vamm/takerOrder';
import { compareEvents } from './compareEvents';
import { TakerOrderEvent } from '../../src/utils/types';

describe('taker order parser', () => {
  test('usual event', () => {
    const chainId = 1;
    const source = '0xe9A6569995F3D8EC971F1D314e0e832C38a735Cc';

    const blockNumber = 17178234;
    const blockHash = 'Block-Hash';
    const transactionIndex = 21;
    const transactionHash =
      '0x2ef67d6f04295106894d762e66c6fd39ba36c02d43dac503df0bc7272803f40A';
    const logIndex = 124;

    const blockTimestamp = 1683092975; // May 03 2023 05:49:35 GMT+0000
    const accountId = BigNumber.from('1000000000');
    const marketId = BigNumber.from('1111111111');
    const maturityTimestamp = 1685534400; // May 31 2023 12:00:00 GMT+0000
    const executedBaseAmount = BigNumber.from(100000000);
    const executedQuoteAmount = BigNumber.from(-550000000);
    const annualizedBaseAmount = BigNumber.from(7500000);

    const event = {
      address: source,
      blockNumber,
      blockHash,
      transactionIndex,
      transactionHash,
      logIndex,
      args: {
        blockTimestamp,
        accountId,
        marketId,
        maturityTimestamp,
        executedBaseAmount,
        executedQuoteAmount,
        annualizedBaseAmount,
      },
    } as unknown as Event;

    const takerOrderEvent = parseTakerOrder(chainId, event);

    console.log('taker order event:', takerOrderEvent);

    const expectedTakerOrderEvent: TakerOrderEvent = {
      id: '1_taker-order_block-hash_0x2ef67d6f04295106894d762e66c6fd39ba36c02d43dac503df0bc7272803f40a_124',
      type: 'taker-order',

      chainId: 1,
      source: '0xe9a6569995f3d8ec971f1d314e0e832c38a735cc',

      blockTimestamp: 1683092975,
      blockNumber: 17178234,
      blockHash: 'block-hash',

      transactionIndex: 21,
      transactionHash:
        '0x2ef67d6f04295106894d762e66c6fd39ba36c02d43dac503df0bc7272803f40a',
      logIndex: 124,

      accountId: '1000000000',

      marketId: '1111111111',
      maturityTimestamp: 1685534400,
      quoteToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',

      executedBaseAmount: 100,
      executedQuoteAmount: -550,

      annualizedBaseAmount: 7.5,
    };

    expect(compareEvents(takerOrderEvent, expectedTakerOrderEvent)).toBe(null);
  });
});
