import { EventFilter } from 'ethers';
import { sync } from '../../src/process/sync';
import { collateralUpdateEvmEvent } from '../utils/evmEventMocks';
import { parseCollateralUpdate } from '../../src/event-parsers/core/collateralUpdate';
import { pullCollateralUpdateEvent } from '../../src/services/big-query/raw-collateral-updates-table/pull-data/pullCollateralUpdateEvent';
import { getBigQuery } from '../../src/services/big-query/client';
import { getCoreContract } from '../../src/contract-generators/core';
import { getDatedIrsInstrumentContract } from '../../src/contract-generators/dated-irs-instrument';
import { getDatedIrsVammContract } from '../../src/contract-generators/dated-irs-vamm';

jest.setTimeout(100_000);

// Mock provider.getBlockNumber to 0
jest.mock('../../src/services/provider.ts', () => ({
  getProvider: () => ({
    getBlockNumber: async () => 0,
  }),
}));

// Mock all dependencies with blank functions
jest.mock('../../src/contract-generators/core.ts', () => ({
  getCoreContract: jest.fn(() => {}),
}));

jest.mock('../../src/contract-generators/dated-irs-instrument.ts', () => ({
  getDatedIrsInstrumentContract: jest.fn(() => {}),
}));

jest.mock('../../src/contract-generators/dated-irs-vamm.ts', () => ({
  getDatedIrsVammContract: jest.fn(() => {}),
}));

jest.mock(
  '../../src/services/big-query/raw-collateral-updates-table/pull-data/pullCollateralUpdateEvent.ts',
  () => ({
    pullCollateralUpdateEvent: jest.fn(() => {}),
  }),
);

jest.mock('../../src/services/big-query/client.ts', () => ({
  getBigQuery: jest.fn(() => {}),
}));

// Unit tests
describe('Collateral Update Indexer unit tests', () => {
  it('new event', async () => {
    // Mock core contract event filters
    {
      const queryFilter = jest.fn(async () => {});
      (queryFilter as jest.Mock).mockResolvedValueOnce([
        collateralUpdateEvmEvent,
      ]);
      (queryFilter as jest.Mock).mockResolvedValueOnce([]);

      (getCoreContract as jest.Mock).mockReturnValueOnce({
        queryFilter,
        filters: {
          MarketFeeConfigured: () => null as unknown as EventFilter,
          CollateralUpdate: () => null as unknown as EventFilter,
        },
      });
    }

    // Mock instrument contract event filters
    {
      const queryFilter = jest.fn(async () => {});
      (queryFilter as jest.Mock).mockResolvedValueOnce([]);
      (queryFilter as jest.Mock).mockResolvedValueOnce([]);

      (getDatedIrsInstrumentContract as jest.Mock).mockReturnValueOnce({
        queryFilter,
        filters: {
          MarketConfigured: () => null as unknown as EventFilter,
          RateOracleConfigured: () => null as unknown as EventFilter,
        },
      });
    }

    // Mock vamm contract event filters
    {
      const queryFilter = jest.fn(async () => {});
      (queryFilter as jest.Mock).mockResolvedValueOnce([]);
      (queryFilter as jest.Mock).mockResolvedValueOnce([]);

      (getDatedIrsVammContract as jest.Mock).mockReturnValueOnce({
        queryFilter,
        filters: {
          VammCreated: () => null as unknown as EventFilter,
        },
      });
    }

    // Mock getBigQuery
    const query = jest.fn(async () => {});

    (getBigQuery as jest.Mock).mockReturnValueOnce({
      query,
    });

    // Mock pullCollateralUpdateEvent
    (pullCollateralUpdateEvent as jest.Mock).mockResolvedValueOnce(null);

    // Fire call
    await sync([1]);

    // Check expectations
    expect(query.mock.calls.length).toBe(1);
  });

  it('existing event', async () => {
    // Mock core contract event filters
    {
      const queryFilter = jest.fn(async () => {});
      (queryFilter as jest.Mock).mockResolvedValueOnce([
        collateralUpdateEvmEvent,
      ]);
      (queryFilter as jest.Mock).mockResolvedValueOnce([]);

      (getCoreContract as jest.Mock).mockReturnValueOnce({
        queryFilter,
        filters: {
          MarketFeeConfigured: () => null as unknown as EventFilter,
          CollateralUpdate: () => null as unknown as EventFilter,
        },
      });
    }

    // Mock instrument contract event filters
    {
      const queryFilter = jest.fn(async () => {});
      (queryFilter as jest.Mock).mockResolvedValueOnce([]);
      (queryFilter as jest.Mock).mockResolvedValueOnce([]);

      (getDatedIrsInstrumentContract as jest.Mock).mockReturnValueOnce({
        queryFilter,
        filters: {
          MarketConfigured: () => null as unknown as EventFilter,
          RateOracleConfigured: () => null as unknown as EventFilter,
        },
      });
    }

    // Mock vamm contract event filters
    {
      const queryFilter = jest.fn(async () => {});
      (queryFilter as jest.Mock).mockResolvedValueOnce([]);
      (queryFilter as jest.Mock).mockResolvedValueOnce([]);

      (getDatedIrsVammContract as jest.Mock).mockReturnValueOnce({
        queryFilter,
        filters: {
          VammCreated: () => null as unknown as EventFilter,
        },
      });
    }

    // Mock getBigQuery
    const query = jest.fn(async () => {});

    (getBigQuery as jest.Mock).mockReturnValueOnce({
      query,
    });

    // Mock pullCollateralUpdateEvent
    const collateralUpdateEvent = parseCollateralUpdate(
      1,
      collateralUpdateEvmEvent,
    );

    (pullCollateralUpdateEvent as jest.Mock).mockResolvedValueOnce(
      collateralUpdateEvent,
    );

    // Fire call
    await sync([1]);

    // Check expectations
    expect(query.mock.calls.length).toBe(0);
  });
});
