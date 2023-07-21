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

jest.mock(
  '@voltz-protocol/commons-v2/src/v2-smart-contracts/core/contract.ts',
  () => ({
    getCoreContract: jest.fn(() => ({
      queryFilter,
      filters: {
        AccountCreated: () =>
          ProtocolEventType.AccountCreated as unknown as EventFilter,

        AccountOwnerUpdate: () =>
          ProtocolEventType.AccountOwnerUpdate as unknown as EventFilter,

        CollateralConfigured: () =>
          ProtocolEventType.CollateralConfigured as unknown as EventFilter,

        CollateralUpdate: () =>
          ProtocolEventType.CollateralUpdate as unknown as EventFilter,

        Liquidation: () =>
          ProtocolEventType.Liquidation as unknown as EventFilter,

        MarketFeeConfigured: () =>
          ProtocolEventType.MarketFeeConfigured as unknown as EventFilter,

        ProductRegistered: () =>
          ProtocolEventType.ProductRegistered as unknown as EventFilter,
      },
    })),
  }),
);

jest.mock(
  '@voltz-protocol/commons-v2/src/v2-smart-contracts/dated-irs-instrument/contract.ts',
  () => ({
    getDatedIrsInstrumentContract: jest.fn(() => ({
      queryFilter,
      filters: {
        MarketConfigured: () =>
          ProtocolEventType.MarketConfigured as unknown as EventFilter,

        ProductPositionUpdated: () =>
          ProtocolEventType.ProductPositionUpdated as unknown as EventFilter,

        RateOracleConfigured: () =>
          ProtocolEventType.RateOracleConfigured as unknown as EventFilter,
      },
    })),
  }),
);

jest.mock(
  '@voltz-protocol/commons-v2/src/v2-smart-contracts/dated-irs-vamm/contract.ts',
  () => ({
    getDatedIrsVammContract: jest.fn(() => ({
      queryFilter,
      filters: {
        LiquidityChange: () =>
          ProtocolEventType.LiquidityChange as unknown as EventFilter,
        VammCreated: () =>
          ProtocolEventType.VammCreated as unknown as EventFilter,
        VammPriceChange: () =>
          ProtocolEventType.VAMMPriceChange as unknown as EventFilter,
      },
    })),
  }),
);

// Tests
describe('Fetch event tests', () => {
  it.skip('simple flow', async () => {
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
