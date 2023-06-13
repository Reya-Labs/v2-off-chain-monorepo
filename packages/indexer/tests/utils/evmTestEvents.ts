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

export const blockTimestampDefault = 1683092975; // May 03 2023 05:49:35 GMT+0000
export const accountIdDefault = BigNumber.from('1000000000');
export const productIdDefault = BigNumber.from('1');
export const tokenDefault = '0xa0b86991c6218b36c1d19D4a2e9eb0ce3606eB48';
export const marketIdDefault = BigNumber.from('1111111111');
export const maturityTimestampDefault = 1685534400; // May 31 2023 12:00:00 GMT+0000

// todo: add event mocks for null events
export const evmTestEvents: Record<ProtocolEventType, Event> = {
  [ProtocolEventType.account_created]: null as unknown as Event,

  [ProtocolEventType.account_owner_update]: null as unknown as Event,

  [ProtocolEventType.collateral_configured]: null as unknown as Event,

  [ProtocolEventType.collateral_update]: {
    ...defaultEvmEvent,
    args: {
      blockTimestamp: blockTimestampDefault,
      accountId: accountIdDefault,
      collateralType: tokenDefault,
      tokenAmount: BigNumber.from(100000000),
    },
  } as unknown as Event,

  [ProtocolEventType.liquidation]: null as unknown as Event,

  [ProtocolEventType.market_fee_configured]: {
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

  [ProtocolEventType.product_registered]: null as unknown as Event,

  [ProtocolEventType.market_configured]: {
    ...defaultEvmEvent,
    args: {
      blockTimestamp: blockTimestampDefault,
      config: {
        marketId: marketIdDefault,
        quoteToken: tokenDefault,
      },
    },
  } as unknown as Event,

  [ProtocolEventType.product_position_updated]: {
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

  [ProtocolEventType.rate_oracle_configured]: {
    ...defaultEvmEvent,
    args: {
      blockTimestamp: blockTimestampDefault,
      marketId: marketIdDefault,
      oracleAddress: '0xa6ba323693f9e9b591f79fbdb947C7330ca2d7ab',
    },
  } as unknown as Event,

  [ProtocolEventType.liquidity_change]: null as unknown as Event,

  [ProtocolEventType.maker_order]: null as unknown as Event,

  [ProtocolEventType.taker_order]: {
    ...defaultEvmEvent,
    args: {
      blockTimestamp: blockTimestampDefault,
      accountId: accountIdDefault,
      marketId: marketIdDefault,
      maturityTimestamp: maturityTimestampDefault,
      executedBaseAmount: BigNumber.from(100000000),
      executedQuoteAmount: BigNumber.from(-550000000),
      annualizedBaseAmount: BigNumber.from(7500000),
    },
  } as unknown as Event,

  [ProtocolEventType.vamm_created]: {
    ...defaultEvmEvent,
    args: {
      blockTimestamp: 1683092975, // May 03 2023 05:49:35 GMT+0000
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

  [ProtocolEventType.vamm_price_change]: {
    ...defaultEvmEvent,
    args: {
      blockTimestamp: 1683092975, // May 03 2023 05:49:35 GMT+0000
      marketId: BigNumber.from('168236'),
      maturityTimestamp: 1687919400,
      tick: 6060,
    },
  } as unknown as Event,
};
