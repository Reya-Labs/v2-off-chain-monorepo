import { fetchLiquidityIndices } from '../../src/process/fetchLiquidityIndex';
import { createTable } from '../../src/services/big-query/create-tables/createTable';
import { TableType } from '../../src/services/big-query/types';
import { createProtocolV2Dataset } from '../../src/services/big-query/utils/datasets';

jest.setTimeout(100_000);

// Mock environment tag to testing and provider
jest.mock('../../src/utils/env-vars.ts', () => ({
  ...jest.requireActual('../../src/utils/env-vars.ts'),
  getEnvironment: jest.fn(() => 'TESTING'),
}));

jest.mock(
  '../../src/services/big-query/cross-queries/pullRateOracleEntries.ts',
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
