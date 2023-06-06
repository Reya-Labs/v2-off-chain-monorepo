import { compareEvents } from '../utils/compareEvents';
import { productPositionUpdatedEvmEvent } from '../utils/evmEventMocks';
import { ProductPositionUpdatedEvent } from '@voltz-protocol/commons-v2';
import { parseProductPositionUpdated } from '../../src/event-parsers/dated-irs-instrument/productPositionUpdated';

describe('product position updated', () => {
  test('usual event', () => {
    const chainId = 1;

    const expectedEvent: ProductPositionUpdatedEvent = {
      id: '1_product-position-updated_Block-Hash_0x2ef67d6f04295106894d762e66c6fd39ba36c02d43dac503df0bc7272803f40A_123',
      type: 'product-position-updated',

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
      baseDelta: 100,
      quoteDelta: -500,
    };

    const outputEvent = parseProductPositionUpdated(
      chainId,
      productPositionUpdatedEvmEvent,
    );

    expect(compareEvents(outputEvent, expectedEvent)).toBe(null);
  });
});
