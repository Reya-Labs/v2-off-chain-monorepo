import { EventFilter } from 'ethers';
import { sync } from '../../src/process/sync';
import { collateralUpdateEvmEvent } from '../utils/evmEventMocks';
import { getCoreContract } from '../../src/contract-generators/core';
import { createTable } from '../../src/services/big-query/create-tables/createTable';
import { createProtocolV2Dataset } from '../../src/services/big-query/utils/datasets';

jest.setTimeout(100_000);

// Mock environment tag to testing and provider
jest.mock('../../src/utils/env-vars.ts', () => ({
  getEnvironment: jest.fn(() => 'TESTING'),
}));

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

// Tests
describe.skip('Collateral Update Indexer integration test', () => {
  it('simple flow', async () => {
    await createProtocolV2Dataset();
    await createTable('collateral_updates');

    // Mock getCoreContract
    (getCoreContract as jest.Mock).mockReturnValueOnce({
      queryFilter: async () => [
        collateralUpdateEvmEvent,
        collateralUpdateEvmEvent,
      ],
      filters: {
        CollateralUpdate: () => null as unknown as EventFilter,
      },
    });

    // Fire call
    await sync([1]);
  });
});
