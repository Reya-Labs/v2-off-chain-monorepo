import { EventFilter } from 'ethers';
import { sync } from '../../src/process/sync';
import {
  collateralUpdateEvmEvent,
  marketConfiguredEvmEvent,
  marketFeeConfiguredEvmEvent,
  productPositionUpdatedEvmEvent,
  rateOracleConfiguredEvmEvent,
  vammCreatedEvmEvent,
  vammPriceChangeEvmEvent,
} from '../utils/evmEventMocks';
import { getCoreContract } from '../../src/contract-generators/core';
import { createTable } from '@voltz-protocol/commons-v2';
import { createProtocolV2Dataset } from '@voltz-protocol/commons-v2';
import { TableType } from '@voltz-protocol/commons-v2';
import { getDatedIrsInstrumentContract } from '../../src/contract-generators/dated-irs-instrument';
import { getDatedIrsVammContract } from '../../src/contract-generators/dated-irs-vamm';

jest.setTimeout(100_000);

// Mock environment tag to testing and provider
jest.mock('@voltz-protocol/commons-v2/src/utils/env-vars.ts', () => ({
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
describe.skip('Collateral Update Indexer integration test', () => {
  it('simple flow', async () => {
    await createProtocolV2Dataset();
    await createTable(TableType.raw_market_configured);
    await createTable(TableType.raw_market_fee_configured);
    await createTable(TableType.raw_rate_oracle_configured);
    await createTable(TableType.raw_collateral_updates);
    await createTable(TableType.raw_vamm_created);
    await createTable(TableType.raw_vamm_price_change);
    await createTable(TableType.raw_product_position_updated);
    await createTable(TableType.markets);
    await createTable(TableType.positions);

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
      (queryFilter as jest.Mock).mockResolvedValueOnce([
        productPositionUpdatedEvmEvent,
      ]);

      (getDatedIrsInstrumentContract as jest.Mock).mockReturnValueOnce({
        queryFilter,
        filters: {
          MarketConfigured: () => null as unknown as EventFilter,
          RateOracleConfigured: () => null as unknown as EventFilter,
          ProductPositionUpdated: () => null as unknown as EventFilter,
        },
      });
    }

    // Mock instrument contract event filters
    {
      const queryFilter = jest.fn(async () => {});
      (queryFilter as jest.Mock).mockResolvedValueOnce([vammCreatedEvmEvent]);
      (queryFilter as jest.Mock).mockResolvedValueOnce([
        vammPriceChangeEvmEvent,
      ]);

      (getDatedIrsVammContract as jest.Mock).mockReturnValueOnce({
        queryFilter,
        filters: {
          VammCreated: () => null as unknown as EventFilter,
          VammPriceChange: () => null as unknown as EventFilter,
        },
      });
    }

    // Fire call
    await sync([1]);
  });
});
