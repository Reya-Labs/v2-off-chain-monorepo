import { BigNumber, Event } from 'ethers';
import { ZERO_ADDRESS } from '../../src/utils/constants';

const evmEventDefault = {
  address: '0xe9A6569995F3D8EC971F1D314e0e832C38a735Cc',
  blockNumber: 17178234,
  blockHash: 'Block-Hash',
  transactionIndex: 21,
  transactionHash:
    '0x2ef67d6f04295106894d762e66c6fd39ba36c02d43dac503df0bc7272803f40A',
  logIndex: 123,
  args: {
    blockTimestamp: 1683092975, // May 03 2023 05:49:35 GMT+0000
    accountId: BigNumber.from('1000000000'),
    collateralType: '0xa0b86991c6218b36c1d19D4a2e9eb0ce3606eB48',
    tokenAmount: BigNumber.from(100000000),
  },
};

const blockTimestampDefault = 1683092975; // May 03 2023 05:49:35 GMT+0000
const accountIdDefault = BigNumber.from('1000000000');
const productIdDefault = BigNumber.from('1');
const tokenDefault = '0xa0b86991c6218b36c1d19D4a2e9eb0ce3606eB48';
const marketIdDefault = BigNumber.from('1111111111');
const maturityTimestampDefault = 1685534400; // May 31 2023 12:00:00 GMT+0000

/////////////////////////////////////////////////////////////////////////////

export const collateralUpdateEvmEvent = {
  ...evmEventDefault,
  args: {
    blockTimestamp: blockTimestampDefault,
    accountId: accountIdDefault,
    collateralType: tokenDefault,
    tokenAmount: BigNumber.from(100000000),
  },
} as unknown as Event;

/////////////////////////////////////////////////////////////////////////////

export const marketFeeConfiguredEvmEvent = {
  ...evmEventDefault,
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
} as unknown as Event;

/////////////////////////////////////////////////////////////////////////////

export const marketConfiguredEvmEvent = {
  ...evmEventDefault,
  args: {
    blockTimestamp: blockTimestampDefault,
    config: {
      marketId: marketIdDefault,
      quoteToken: tokenDefault,
    },
  },
} as unknown as Event;

/////////////////////////////////////////////////////////////////////////////

export const rateOracleConfiguredEvmEvent = {
  ...evmEventDefault,
  args: {
    blockTimestamp: blockTimestampDefault,
    marketId: marketIdDefault,
    oracleAddress: '0xa6ba323693f9e9b591f79fbdb947C7330ca2d7ab',
  },
} as unknown as Event;

/////////////////////////////////////////////////////////////////////////////

export const vammCreatedEvmEvent = {
  ...evmEventDefault,
  args: {
    blockTimestamp: 1683092975, // May 03 2023 05:49:35 GMT+0000
    _marketId: BigNumber.from('168236'),
    _mutableConfig: {
      priceImpactPhi: BigNumber.from('100000000000000000'),
      priceImpactBeta: BigNumber.from('125000000000000000'),
      spread: BigNumber.from('3000000000000000'),
      rateOracle: '0xa0b86991c6218f36c1d19d4a2e9eb0ce3606eb48',
    },
    _config: {
      _maxLiquidityPerTick: BigNumber.from('1000000000000'),
      _tickSpacing: 60,
      maturityTimestamp: 1687919400,
    },
  },
} as unknown as Event;

/////////////////////////////////////////////////////////////////////////////

export const vammPriceChangeEvmEvent = {
  ...evmEventDefault,
  args: {
    blockTimestamp: 1683092975, // May 03 2023 05:49:35 GMT+0000
    marketId: BigNumber.from('168236'),
    maturityTimestamp: 1687919400,
    tick: 6060,
  },
} as unknown as Event;

/////////////////////////////////////////////////////////////////////////////

export const takerOrderEvmEvent = {
  ...evmEventDefault,
  args: {
    blockTimestamp: blockTimestampDefault,
    accountId: accountIdDefault,
    marketId: marketIdDefault,
    maturityTimestamp: maturityTimestampDefault,
    executedBaseAmount: BigNumber.from(100000000),
    executedQuoteAmount: BigNumber.from(-550000000),
    annualizedBaseAmount: BigNumber.from(7500000),
  },
} as unknown as Event;

/////////////////////////////////////////////////////////////////////////////
