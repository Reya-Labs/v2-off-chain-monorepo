import { EventFilter } from 'ethers';
import { sync } from '../../src/process/sync';
import {
  collateralUpdateEvmEvent,
  marketConfiguredEvmEvent,
  marketFeeConfiguredEvmEvent,
  rateOracleConfiguredEvmEvent,
} from '../utils/evmEventMocks';
import { getCoreContract } from '../../src/contract-generators/core';
import { createTable } from '../../src/services/big-query/create-tables/createTable';
import { createProtocolV2Dataset } from '../../src/services/big-query/utils/datasets';
import { TableType } from '../../src/services/big-query/types';
import { getDatedIrsInstrumentContract } from '../../src/contract-generators/dated-irs-instrument';

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

jest.mock('../../src/contract-generators/dated-irs-instrument.ts', () => ({
  getDatedIrsInstrumentContract: jest.fn(() => {}),
}));

jest.mock('../../src/contract-generators/dated-irs-vamm.ts', () => ({
  getDatedIrsVammContract: jest.fn(() => {}),
}));

// Tests
describe('Collateral Update Indexer integration test', () => {
  it('simple flow', async () => {
    await createProtocolV2Dataset();
    await createTable(TableType.raw_market_configured);
    await createTable(TableType.raw_market_fee_configured);
    await createTable(TableType.raw_rate_oracle_configured);
    await createTable(TableType.raw_collateral_updates);

    // Mock core contract event filters
    {
      const queryFilter = jest.fn(async () => {});
      (queryFilter as jest.Mock).mockResolvedValueOnce([
        collateralUpdateEvmEvent,
      ]);
      (queryFilter as jest.Mock).mockResolvedValueOnce([
        marketFeeConfiguredEvmEvent,
      ]);

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
      (queryFilter as jest.Mock).mockResolvedValueOnce([
        marketConfiguredEvmEvent,
      ]);
      (queryFilter as jest.Mock).mockResolvedValueOnce([
        rateOracleConfiguredEvmEvent,
      ]);

      (getDatedIrsInstrumentContract as jest.Mock).mockReturnValueOnce({
        queryFilter,
        filters: {
          MarketConfigured: () => null as unknown as EventFilter,
          RateOracleConfigured: () => null as unknown as EventFilter,
        },
      });
    }

    // Fire call
    await sync([1]);
  });
});
