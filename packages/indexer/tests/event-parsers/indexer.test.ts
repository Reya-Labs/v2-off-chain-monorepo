import { EventFilter } from 'ethers';
import { sync } from '../../src/process/sync';
import { collateralUpdateEvmEvent } from '../utils/evmEventMocks';
import { parseCollateralUpdate } from '../../src/event-parsers/core/collateralUpdate';
import { pullCollateralUpdateEvent } from '../../src/services/big-query/collateral-updates-table/pull-data/pullCollateralUpdateEvent';
import { getBigQuery } from '../../src/services/big-query/client';
import { getCoreContract } from '../../src/contract-generators/core';

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

jest.mock(
  '../../src/services/big-query/collateral-updates-table/pull-data/pullCollateralUpdateEvent.ts',
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
    // Mock getCoreContract
    (getCoreContract as jest.Mock).mockReturnValueOnce({
      queryFilter: async () => [collateralUpdateEvmEvent],
      filters: {
        CollateralUpdate: () => null as unknown as EventFilter,
      },
    });

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
    // Mock getCoreContract
    (getCoreContract as jest.Mock).mockReturnValueOnce({
      queryFilter: async () => [collateralUpdateEvmEvent],
      filters: {
        CollateralUpdate: () => null as unknown as EventFilter,
      },
    });

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
