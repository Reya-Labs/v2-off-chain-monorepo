import { compareEvents } from '../utils/compareEvents';
import {
  ProductPositionUpdatedEvent,
  ProtocolEventType,
} from '@voltz-protocol/bigquery-v2';
import { parseProductPositionUpdated } from '../../src/event-parsers/parseProductPositionUpdated';
import { evmTestEvents } from '../utils/evmTestEvents';

describe('product position updated', () => {
  test('usual event', () => {
    const chainId = 1;
    const type = ProtocolEventType.ProductPositionUpdated;
    const evmEvent = evmTestEvents[type];

    const event: ProductPositionUpdatedEvent = {
      id: '1$ProductPositionUpdated$Block-Hash$0x2ef67d6f04295106894d762e66c6fd39ba36c02d43dac503df0bc7272803f40A$100',
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

      accountId: '1000000000',
      marketId: '1111111111',
      maturityTimestamp: 1685534400,
      baseDelta: 100,
      quoteDelta: -500,
    };

    const output = parseProductPositionUpdated(chainId, evmEvent);
    expect(compareEvents(output, event)).toBe(null);
  });
});
