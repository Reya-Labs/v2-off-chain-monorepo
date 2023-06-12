import {
  createProtocolV2Dataset,
  createTable,
  TableType,
} from '@voltz-protocol/bigquery-v2';
import { fetchLiquidityIndices } from '../../src/process/fetchLiquidityIndex';

jest.setTimeout(100_000);

// Mock environment tag to testing and provider
jest.mock('@voltz-protocol/commons-v2/src/utils/env-vars.ts', () => ({
  ...jest.requireActual('@voltz-protocol/commons-v2/src/utils/env-vars.ts'),
  getEnvironment: jest.fn(() => 'TESTING'),
}));

jest.mock(
  '@voltz-protocol/commons-v2/src/big-query/cross-queries/pullRateOracleEntries.ts',
  () => ({
    pullRateOracleEntries: jest.fn(() => [
      {
        chainId: 1,
        oracleAddress: '0xa6ba323693f9e9b591f79fbdb947c7330ca2d7ab',
      },
    ]),
  }),
);

// Tests
describe.skip('Liquidity index reader integration test', () => {
  it('simple flow', async () => {
    await createProtocolV2Dataset();
    await createTable(TableType.liquidity_indices);

    // Fire call
    await fetchLiquidityIndices();
  });
});
