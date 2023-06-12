import {
  createProtocolV2Dataset,
  TableType,
  createTable,
} from '@voltz-protocol/bigquery-v2';
import { sync } from '../../../../src/process/sync';
import { chainId, events } from './scenario';

jest.setTimeout(100_000);

// Mock environment tag to testing and provider
jest.mock('@voltz-protocol/commons-v2/src/env-vars.ts', () => ({
  getEnvironment: jest.fn(() => 'TESTING'),
}));

// Mock provider.getBlockNumber to 0
jest.mock('@voltz-protocol/commons-v2/src/provider.ts', () => ({
  getProvider: () => ({
    getBlockNumber: async () => 0,
  }),
}));

// Mock all dependencies with blank functions
jest.mock('../../../../src/fetch-events/fetchEvents', () => ({
  fetchEvents: jest.fn(() => events),
}));

// Tests
describe.skip('Indexer integration test', () => {
  it('simple flow', async () => {
    // Create dataset and create all tables
    await createProtocolV2Dataset();
    await Promise.allSettled(
      Object.keys(TableType).map((tableType) =>
        createTable(tableType as TableType),
      ),
    );

    // Fire call
    await sync([chainId]);
  });
});
