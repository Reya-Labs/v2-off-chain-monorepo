import { compareEvents } from '../utils/compareEvents';
import { parseCollateralUpdate } from '../../src/event-parsers/parseCollateralUpdate';
import { collateralUpdateEvmEvent } from '../utils/evmEventMocks';
import { CollateralUpdateEvent } from '@voltz-protocol/commons-v2';

describe('taker order parser', () => {
  test('usual event', () => {
    const chainId = 1;

    const collateralUpdateEvent: CollateralUpdateEvent = {
      id: '1_collateral-update_Block-Hash_0x2ef67d6f04295106894d762e66c6fd39ba36c02d43dac503df0bc7272803f40A_123',
      type: 'collateral-update',

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
      collateralType: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      collateralAmount: 100,
      liquidatorBoosterAmount: 0,
    };

    const outputCollateralUpdateEvent = parseCollateralUpdate(
      chainId,
      collateralUpdateEvmEvent,
    );

    expect(
      compareEvents(outputCollateralUpdateEvent, collateralUpdateEvent),
    ).toBe(null);
  });
});
