import { parseVammPriceChange } from '../../src/event-parsers/dated-irs-vamm/vammPriceChange';
import { VammPriceChangeEvent } from '../../src/event-parsers/types';
import { compareEvents } from '../utils/compareEvents';
import { vammPriceChangeEvmEvent } from '../utils/evmEventMocks';

describe('vamm price change parser', () => {
  test('usual event', () => {
    const chainId = 1;

    const vammPriceChangeEvent: VammPriceChangeEvent = {
      id: '1_vamm-price-change_Block-Hash_0x2ef67d6f04295106894d762e66c6fd39ba36c02d43dac503df0bc7272803f40A_123',
      type: 'vamm-price-change',

      chainId: 1,
      source: '0xe9a6569995f3d8ec971f1d314e0e832c38a735cc',

      blockTimestamp: 1683092975,
      blockNumber: 17178234,
      blockHash: 'Block-Hash',

      transactionIndex: 21,
      transactionHash:
        '0x2ef67d6f04295106894d762e66c6fd39ba36c02d43dac503df0bc7272803f40A',
      logIndex: 123,

      marketId: '168236',
      maturityTimestamp: 1687919400,
      tick: 6060,
    };

    const outputVammPriceChangeEvent = parseVammPriceChange(
      chainId,
      vammPriceChangeEvmEvent,
    );

    expect(
      compareEvents(outputVammPriceChangeEvent, vammPriceChangeEvent),
    ).toBe(null);
  });
});
