import { compareEvents } from '../utils/compareEvents';
import { parseCollateralUpdate } from '../../src/event-parsers/parseCollateralUpdate';
import {
  CollateralUpdateEvent,
  ProtocolEventType,
} from '@voltz-protocol/bigquery-v2';
import { evmTestEvents } from '../utils/evmTestEvents';

describe('taker order parser', () => {
  test('usual event', () => {
    const chainId = 1;
    const type = ProtocolEventType.CollateralUpdate;
    const evmEvent = evmTestEvents[type];

    const event: CollateralUpdateEvent = {
      id: '1$CollateralUpdate$Block-Hash$0x2ef67d6f04295106894d762e66c6fd39ba36c02d43dac503df0bc7272803f40A$100',
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
      collateralType: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      collateralAmount: 100,
      liquidatorBoosterAmount: 0,
    };

    const output = parseCollateralUpdate(chainId, evmEvent);
    expect(compareEvents(output, event)).toBe(null);
  });
});
