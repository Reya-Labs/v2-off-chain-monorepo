import { createProtocolV2Dataset } from '@voltz-protocol/bigquery-v2';
import { sync } from '../../../../src/process/sync';
import { chainId, events } from './scenario';

jest.setTimeout(1_000_000);

// Mock environment tag to testing and provider
jest.mock('@voltz-protocol/commons-v2', () => ({
  // Keep all the other functionalities as they are
  ...jest.requireActual('@voltz-protocol/commons-v2'),

  getEnvironmentV2: jest.fn(() => 'UT'),

  getProvider: () => ({
    getBlockNumber: async () => 0,
  }),

  getMarketQuoteToken: jest.fn(
    () => '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  ),
}));

// Mock all dependencies with blank functions
jest.mock('../../../../src/fetch-events/fetchEvents', () => ({
  fetchEvents: jest.fn(() => events),
}));

// Tests
describe.skip('Indexer integration test', () => {
  it('simple flow', async () => {
    await createProtocolV2Dataset('UT');

    // Fire call
    await sync([chainId]);
  });
});
