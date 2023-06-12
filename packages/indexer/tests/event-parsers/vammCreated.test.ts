import { compareEvents } from '../utils/compareEvents';
import { vammCreatedEvmEvent } from '../utils/evmEventMocks';
import { VammCreatedEvent } from '@voltz-protocol/commons-v2';
import { parseVammCreated } from '../../src/event-parsers/dated-irs-vamm/vammCreated';

describe('vamm created parser', () => {
  test('usual event', () => {
    const chainId = 1;

    const vammCreatedEvent: VammCreatedEvent = {
      id: '1_vamm-created_Block-Hash_0x2ef67d6f04295106894d762e66c6fd39ba36c02d43dac503df0bc7272803f40A_123',
      type: 'vamm-created',

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

      priceImpactPhi: 0.1,
      priceImpactBeta: 0.125,
      spread: 0.003,
      rateOracle: '0xa0b86991c6218f36c1d19d4a2e9eb0ce3606eb48',

      maxLiquidityPerTick: '1000000000000',
      tickSpacing: 60,
      maturityTimestamp: 1687919400,

      tick: 6060,
    };

    const outputVammCreatedEvent = parseVammCreated(
      chainId,
      vammCreatedEvmEvent,
    );

    expect(compareEvents(outputVammCreatedEvent, vammCreatedEvent)).toBe(null);
  });
});
