import { BigNumber, Event } from 'ethers';
import { ProtocolEventType } from '@voltz-protocol/bigquery-v2';
import { ZERO_ADDRESS } from '@voltz-protocol/commons-v2';

export const defaultEvmEvent = {
  address: '0xe9A6569995F3D8EC971F1D314e0e832C38a735Cc',
  blockHash: 'Block-Hash',
  transactionIndex: 10,
  transactionHash:
    '0x2ef67d6f04295106894d762e66c6fd39ba36c02d43dac503df0bc7272803f40A',
  blockNumber: 1,
  logIndex: 100,
};

export const blockTimestampDefault = BigNumber.from(1683092975); // May 03 2023 05:49:35 GMT+0000
export const accountIdDefault = BigNumber.from('1000000000');
export const productIdDefault = BigNumber.from('1');
export const tokenDefault = '0xa0b86991c6218b36c1d19D4a2e9eb0ce3606eB48';
export const marketIdDefault = BigNumber.from('1111111111');
export const maturityTimestampDefault = 1685534400; // May 31 2023 12:00:00 GMT+0000

// todo: add event mocks for null events
export const evmTestEvents: Record<ProtocolEventType, Event> = {
  [ProtocolEventType.AccountCreated]: null as unknown as Event,

  [ProtocolEventType.AccountOwnerUpdate]: null as unknown as Event,

  [ProtocolEventType.CollateralConfigured]: null as unknown as Event,

  [ProtocolEventType.CollateralUpdate]: {
    ...defaultEvmEvent,
    args: {
      blockTimestamp: blockTimestampDefault,
      accountId: accountIdDefault,
      collateralType: tokenDefault,
      tokenAmount: BigNumber.from(100000000),
    },
  } as unknown as Event,

  [ProtocolEventType.DepositedWithdrawn]: null as unknown as Event,

  [ProtocolEventType.Liquidation]: null as unknown as Event,

  [ProtocolEventType.MarketFeeConfigured]: {
    ...defaultEvmEvent,
    args: {
      blockTimestamp: blockTimestampDefault,
      config: {
        productId: productIdDefault,
        marketId: marketIdDefault,
        feeCollectorAccountId: ZERO_ADDRESS,
        atomicMakerFee: BigNumber.from('10000000000000000'), // 1%
        atomicTakerFee: BigNumber.from('20000000000000000'), // 2%
      },
    },
  } as unknown as Event,

  [ProtocolEventType.ProductRegistered]: null as unknown as Event,

  [ProtocolEventType.DatedIRSPositionSettled]: null as unknown as Event,

  [ProtocolEventType.MarketConfigured]: {
    ...defaultEvmEvent,
    args: {
      blockTimestamp: blockTimestampDefault,
      config: {
        marketId: marketIdDefault,
        quoteToken: tokenDefault,
      },
    },
  } as unknown as Event,

  [ProtocolEventType.ProductPositionUpdated]: {
    ...defaultEvmEvent,
    args: {
      blockTimestamp: blockTimestampDefault,
      accountId: accountIdDefault,
      marketId: marketIdDefault,
      maturityTimestamp: maturityTimestampDefault,
      baseDelta: BigNumber.from('100000000'),
      quoteDelta: BigNumber.from('-500000000'),
    },
  } as unknown as Event,

  [ProtocolEventType.RateOracleConfigured]: {
    ...defaultEvmEvent,
    args: {
      blockTimestamp: blockTimestampDefault,
      marketId: marketIdDefault,
      oracleAddress: '0xa6ba323693f9e9b591f79fbdb947C7330ca2d7ab',
    },
  } as unknown as Event,

  [ProtocolEventType.TakerOrder]: null as unknown as Event,

  [ProtocolEventType.LiquidityChange]: null as unknown as Event,

  [ProtocolEventType.VammCreated]: {
    ...defaultEvmEvent,
    args: {
      blockTimestamp: blockTimestampDefault,
      marketId: BigNumber.from('168236'),
      tick: 1200,
      mutableConfig: {
        priceImpactPhi: BigNumber.from('100000000000000000'),
        priceImpactBeta: BigNumber.from('125000000000000000'),
        spread: BigNumber.from('3000000000000000'),
        rateOracle: '0xa0b86991c6218f36c1d19d4a2e9eb0ce3606eb48',
      },
      config: {
        maxLiquidityPerTick: BigNumber.from('1000000000000'),
        tickSpacing: 60,
        maturityTimestamp: 1687919400,
      },
    },
  } as unknown as Event,

  [ProtocolEventType.VAMMPriceChange]: {
    ...defaultEvmEvent,
    args: {
      blockTimestamp: blockTimestampDefault,
      marketId: BigNumber.from('168236'),
      maturityTimestamp: 1687919400,
      tick: 6060,
    },
  } as unknown as Event,
};
