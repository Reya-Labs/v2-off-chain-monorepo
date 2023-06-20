import { compareEvents } from '../utils/compareEvents';
import {
  ProtocolEventType,
  VammCreatedEvent,
} from '@voltz-protocol/bigquery-v2';
import { parseVammCreated } from '../../src/event-parsers/parseVammCreated';
import { evmTestEvents } from '../utils/evmTestEvents';

describe('vamm created parser', () => {
  test('usual event', () => {
    const chainId = 1;
    const type = ProtocolEventType.VammCreated;
    const evmEvent = evmTestEvents[type];

    const event: VammCreatedEvent = {
      id: '1$VammCreated$Block-Hash$0x2ef67d6f04295106894d762e66c6fd39ba36c02d43dac503df0bc7272803f40A$100',
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

      priceImpactPhi: 0.1,
      priceImpactBeta: 0.125,
      spread: 0.003,
      rateOracle: '0xa0b86991c6218f36c1d19d4a2e9eb0ce3606eb48',

      maxLiquidityPerTick: '1000000000000',
      tickSpacing: 60,
      maturityTimestamp: 1687919400,

      tick: 1200,
    };

    const output = parseVammCreated(chainId, evmEvent);
    expect(compareEvents(output, event)).toBe(null);
  });
});
