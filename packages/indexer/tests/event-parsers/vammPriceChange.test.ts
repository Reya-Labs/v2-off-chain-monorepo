import { parseVammPriceChange } from '../../src/event-parsers/parseVammPriceChange';
import {
  ProtocolEventType,
  VammPriceChangeEvent,
} from '@voltz-protocol/commons-v2';
import { compareEvents } from '../utils/compareEvents';
import { evmTestEvents } from '../utils/evmTestEvents';

describe('vamm price change parser', () => {
  test('usual event', () => {
    const chainId = 1;
    const type = ProtocolEventType.vamm_price_change;
    const evmEvent = evmTestEvents[type];

    const event: VammPriceChangeEvent = {
      id: '1$vamm_price_change$Block-Hash$0x2ef67d6f04295106894d762e66c6fd39ba36c02d43dac503df0bc7272803f40A$100',
      type,

      chainId,
      source: '0xe9a6569995f3d8ec971f1d314e0e832c38a735cc',

      blockTimestamp: 1683092975,
      blockNumber: 1,
      blockHash: 'Block-Hash',

      transactionIndex: 10,
      transactionHash:
        '0x2ef67d6f04295106894d762e66c6fd39ba36c02d43dac503df0bc7272803f40A',
      logIndex: 100,

      marketId: '168236',
      maturityTimestamp: 1687919400,
      tick: 6060,
    };

    const output = parseVammPriceChange(chainId, evmEvent);
    expect(compareEvents(output, event)).toBe(null);
  });
});
