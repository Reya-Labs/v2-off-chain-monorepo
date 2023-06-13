import { EventFilter } from 'ethers';
import { evmTestEvents } from '../utils/evmTestEvents';
import { ProtocolEventType } from '@voltz-protocol/bigquery-v2';
import { fetchEvents } from '../../src/fetch-events/fetchEvents';

// Mock smart contract dependencies

const queryFilter = jest.fn(async (eventType: ProtocolEventType) => {
  const testEvent = evmTestEvents[eventType];
  if (testEvent) {
    return [testEvent];
  }

  return [];
});

jest.mock('@voltz-protocol/commons-v2/src/v2-smart-contracts/core.ts', () => ({
  getCoreContract: jest.fn(() => ({
    queryFilter,
    filters: {
      AccountCreated: () =>
        ProtocolEventType.account_created as unknown as EventFilter,

      AccountOwnerUpdate: () =>
        ProtocolEventType.account_owner_update as unknown as EventFilter,

      CollateralConfigured: () =>
        ProtocolEventType.collateral_configured as unknown as EventFilter,

      CollateralUpdate: () =>
        ProtocolEventType.collateral_update as unknown as EventFilter,

      Liquidation: () =>
        ProtocolEventType.liquidation as unknown as EventFilter,

      MarketFeeConfigured: () =>
        ProtocolEventType.market_fee_configured as unknown as EventFilter,

      ProductRegistered: () =>
        ProtocolEventType.product_registered as unknown as EventFilter,
    },
  })),
}));

jest.mock(
  '@voltz-protocol/commons-v2/src/v2-smart-contracts/dated-irs-instrument.ts',
  () => ({
    getDatedIrsInstrumentContract: jest.fn(() => ({
      queryFilter,
      filters: {
        MarketConfigured: () =>
          ProtocolEventType.market_configured as unknown as EventFilter,

        ProductPositionUpdated: () =>
          ProtocolEventType.product_position_updated as unknown as EventFilter,

        RateOracleConfigured: () =>
          ProtocolEventType.rate_oracle_configured as unknown as EventFilter,
      },
    })),
  }),
);

jest.mock(
  '@voltz-protocol/commons-v2/src/v2-smart-contracts/dated-irs-vamm.ts',
  () => ({
    getDatedIrsVammContract: jest.fn(() => ({
      queryFilter,
      filters: {
        LiquidityChange: () =>
          ProtocolEventType.liquidity_change as unknown as EventFilter,
        MakerOrder: () =>
          ProtocolEventType.maker_order as unknown as EventFilter,
        TakerOrder: () =>
          ProtocolEventType.taker_order as unknown as EventFilter,
        VammCreated: () =>
          ProtocolEventType.vamm_created as unknown as EventFilter,
        VammPriceChange: () =>
          ProtocolEventType.vamm_price_change as unknown as EventFilter,
      },
    })),
  }),
);

// Tests
describe('Fetch event tests', () => {
  it('simple flow', async () => {
    // Fire call
    const events = await fetchEvents(1, 0, 0);

    // todo: enrich expectations
    expect(events.length).toBeGreaterThan(0);
    expect(
      events.every(
        (v, i) =>
          i === 0 ||
          v.blockNumber >= events[i - 1].blockNumber ||
          (v.blockNumber === events[i - 1].blockNumber &&
            v.logIndex > events[i - 1].logIndex),
      ),
    );
  });
});
